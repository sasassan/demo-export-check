import { buildChecklistFromAssessment } from "@/lib/checklist/generator";
import { mergeChecklistItems } from "@/lib/checklist/merge";
import { generateNarrative, buildフォールバックNarrative } from "@/lib/providers/openai";
import { OpenAIProvider } from "@/lib/providers/openai-provider";
import { ClaudeProvider } from "@/lib/providers/claude-provider";
import { GeminiProvider } from "@/lib/providers/gemini-provider";
import type { InvestigationProvider } from "@/lib/providers/types";
import {
  assertCaseOwner,
  getCaseDetail,
  replaceCaseChecklist,
  saveAssessment,
  updateInvestigationStatus,
} from "@/lib/db/repository";
import { collectEvidence } from "@/lib/investigation/normalizers";
import { buildDimensionScores, buildScoreSummary } from "@/lib/risk/scoring";
import type {
  AssessmentRecord,
  InvestigationFinding,
  ModelResult,
  ProviderResult,
  DimensionScore,
  AiModel,
  ReviewMeetingEntry,
  ImprovementStep,
  WorstCaseScenario,
  CrossReviewSummary,
  CrossReviewDimension,
  CrossReviewVote,
  IntegratedEvaluationSummary,
  IntegratedEvaluationPoint,
  Grade,
} from "@/lib/types";
import { getEnabledAiModels } from "@/lib/ai/config";
import { scoreToGrade } from "@/lib/risk/rules";
import { RISK_DIMENSIONS, type RiskDimension } from "@/lib/constants";
import { getRegulationUpdatesForCase } from "@/lib/regulation-updates";

const MODEL_LABELS: Record<string, string> = {
  "openai-gpt4o": "GPT-4o",
  "anthropic-claude": "Claude",
  "google-gemini": "Gemini",
};

const PROVIDER_MODEL_MAP: Record<string, AiModel> = {
  "openai-gpt4o": "gpt-4o",
  "anthropic-claude": "claude",
  "google-gemini": "gemini",
};

const GRADE_ORDER: Grade[] = ["A", "B", "C"];

function worseGrade(a: Grade, b: Grade): Grade {
  return GRADE_ORDER.indexOf(a) >= GRADE_ORDER.indexOf(b) ? a : b;
}

/**
 * 複数AIモデルのfindingsを次元ごとに集約する。
 * 同一次元に複数モデルの評価がある場合、最悪ケースのスコアを採用する。
 */
function aggregateFindings(results: ProviderResult[]): InvestigationFinding[] {
  const byDimension = new Map<RiskDimension, InvestigationFinding[]>();

  for (const result of results) {
    for (const finding of result.findings) {
      const dim = finding.dimension as RiskDimension;
      if (!byDimension.has(dim)) {
        byDimension.set(dim, []);
      }
      byDimension.get(dim)!.push(finding);
    }
  }

  const aggregated: InvestigationFinding[] = [];

  for (const dim of RISK_DIMENSIONS) {
    const findings = byDimension.get(dim);
    if (!findings || findings.length === 0) continue;

    // 最悪ケース（最大スコア）を基準にする
    const worst = findings.reduce((a, b) => (a.baseScore >= b.baseScore ? a : b));

    // 複数モデルの根拠を結合
    const allRationales = findings
      .filter((f) => f.rationale)
      .map(
        (f) =>
          `[${MODEL_LABELS[results.find((r) => r.findings.includes(f))?.providerName ?? ""] ?? f.aiModel ?? "AI"}] ${f.rationale}`,
      );
    const combinedRationale =
      allRationales.length > 1
        ? allRationales.join("\n\n")
        : (worst.rationale ?? "");

    // 全エビデンスを統合
    const allEvidence = findings.flatMap((f) => f.evidence);

    aggregated.push({
      ...worst,
      rationale: combinedRationale,
      evidence: allEvidence,
    });
  }

  return aggregated;
}

/**
 * 各AIモデルの個別評価結果を構築する（UIでの比較表示用）
 */
function buildModelResults(results: ProviderResult[]): ModelResult[] {
  return results.map((result) => {
    const model = result.providerName.includes("claude")
      ? ("claude" as AiModel)
      : result.providerName.includes("openai") ||
          result.providerName.includes("gpt")
        ? ("gpt-4o" as AiModel)
        : result.providerName.includes("gemini")
          ? ("gemini" as AiModel)
          : ("mock" as AiModel);

    const modelLabel = MODEL_LABELS[result.providerName] ?? result.providerName;

    const dimensions: DimensionScore[] = result.findings.map((f) => ({
      dimension: f.dimension,
      label: f.label,
      score: f.baseScore,
      grade: scoreToGrade(f.baseScore),
      rationale: f.rationale,
      recommendedAction: f.recommendedAction,
      aiModel: model,
    }));

    return {
      model,
      modelLabel,
      actualModelName: result.actualModelName,
      dimensions,
      reviewComment: result.reviewComment,
      keyRisk: result.keyRisk,
      providerStatus: result.providerStatus,
      providerStatusLabel: result.providerStatusLabel,
      providerReason: result.providerReason,
    };
  });
}

/**
 * AI同士の一致率を計算する（次元ごとにグレードが一致している割合）
 */
function calcAgreementRate(results: ProviderResult[]): number {
  const realResults = results.filter((r) => r.findings.length > 0);
  if (realResults.length < 2) return 100;

  let totalPairs = 0;
  let matchingPairs = 0;

  for (const dim of RISK_DIMENSIONS) {
    const grades = realResults
      .map((r) => {
        const f = r.findings.find((f) => f.dimension === dim);
        return f ? scoreToGrade(f.baseScore) : null;
      })
      .filter((g): g is "A" | "B" | "C" => g !== null);

    if (grades.length < 2) continue;

    // 全ペアを比較
    for (let i = 0; i < grades.length; i++) {
      for (let j = i + 1; j < grades.length; j++) {
        totalPairs++;
        if (grades[i] === grades[j]) matchingPairs++;
      }
    }
  }

  if (totalPairs === 0) return 100;
  return Math.round((matchingPairs / totalPairs) * 100);
}

/**
 * AI議論タイムライン（ReviewMeetingEntry配列）を構築する
 */
function buildReviewMeeting(results: ProviderResult[]): ReviewMeetingEntry[] {
  const providerModelMap: Record<string, AiModel> = {
    "openai-gpt4o": "gpt-4o",
    "anthropic-claude": "claude",
    "google-gemini": "gemini",
  };

  return results
    .filter((r) => r.reviewComment || r.keyRisk)
    .map((r) => {
      const model = providerModelMap[r.providerName] ?? "mock";
      const modelLabel = MODEL_LABELS[r.providerName] ?? r.providerName;

      // そのプロバイダーの平均スコアからグレードを算出
      const scores = r.findings.map((f) => f.baseScore);
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 50;
      const overallGrade = scoreToGrade(avgScore);

      return {
        model: model as AiModel,
        modelLabel,
        actualModelName: r.actualModelName,
        reviewComment: r.reviewComment ?? "評価を実施しました。",
        keyRisk: r.keyRisk ?? "特記事項なし",
        overallGrade,
      } as ReviewMeetingEntry;
    });
}

/**
 * 改善シミュレーションステップを統合し、cumulativeScoreを計算する
 */
function buildImprovementSteps(
  results: ProviderResult[],
  currentAvgScore: number,
): ImprovementStep[] {
  // 全モデルのrawImprovementStepsをマージし、優先度順にソート
  const allSteps = results.flatMap((r) => r.rawImprovementSteps ?? []);

  if (allSteps.length === 0) return [];

  // 同一アクション名の重複除去（優先度が低い方を除外）
  const uniqueSteps = Array.from(
    allSteps.reduce((map, step) => {
      const key = step.action.slice(0, 20); // 先頭20文字でキー
      if (!map.has(key) || map.get(key)!.priority > step.priority) {
        map.set(key, step);
      }
      return map;
    }, new Map<string, typeof allSteps[0]>()),
  )
    .map(([, step]) => step)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5); // 最大5件

  // 現在のスコアは「リスクスコア平均」なので安全スコア = 100 - avgRiskScore
  const baseSafetyScore = Math.max(0, 100 - currentAvgScore);

  let cumulative = baseSafetyScore;
  return uniqueSteps.map((step) => {
    cumulative = Math.min(100, cumulative + step.scoreGain);
    return {
      action: step.action,
      scoreGain: step.scoreGain,
      cumulativeScore: cumulative,
      priority: step.priority,
      detail: step.detail,
    };
  });
}

/**
 * 最悪ケースシナリオをマージ・重複除去する
 */
function buildWorstCaseScenarios(results: ProviderResult[]): WorstCaseScenario[] {
  const all = results.flatMap((r) => r.rawWorstCaseScenarios ?? []);

  // scenarioの先頭10文字でユニーク化
  const unique = Array.from(
    all.reduce((map, s) => {
      const key = s.scenario.slice(0, 10);
      if (!map.has(key)) map.set(key, s);
      return map;
    }, new Map<string, typeof all[0]>()),
  )
    .map(([, s]) => s)
    .slice(0, 5);

  return unique.map((s) => ({
    scenario: s.scenario,
    impact: s.impact,
    probability: s.probability as "低" | "中" | "高",
    grade: s.grade as "A" | "B" | "C",
  }));
}

/**
 * グレードが割れた次元名を抽出する
 */
function findDisagreementDimensions(results: ProviderResult[]): string[] {
  const realResults = results.filter((r) => r.findings.length > 0);
  if (realResults.length < 2) return [];

  const disagreed: string[] = [];

  for (const dim of RISK_DIMENSIONS) {
    const entries = realResults
      .map((r) => r.findings.find((f) => f.dimension === dim))
      .filter((f): f is InvestigationFinding => f !== undefined);

    if (entries.length < 2) continue;

    const grades = entries.map((f) => scoreToGrade(f.baseScore));
    const uniqueGrades = new Set(grades);
    if (uniqueGrades.size > 1) {
      disagreed.push(entries[0].label);
    }
  }

  return disagreed;
}

/**
 * 「利用可能なAIプロバイダーのみ」を対象に、次元ごとの多数決/重み付けコンセンサスを算出する。
 * - consensusGrade: グレードの多数決。1件のみ参加時はそのまま採用。同数タイの場合は安全側（最悪グレード）に倒す
 * - consensusScore: 参加プロバイダーの重み付け平均（現状は等重み）
 * - いずれかのAIが「C」判定した次元は、多数決の結果に関わらずhasDisagreementをtrueにして見落としを防ぐ
 */
function buildCrossReview(
  allResults: ProviderResult[],
  liveResults: ProviderResult[],
  usedフォールバック: boolean,
): CrossReviewSummary {
  const participatingProviders = liveResults.map(
    (r) => PROVIDER_MODEL_MAP[r.providerName] ?? ("mock" as AiModel),
  );
  const skippedProviders = allResults
    .filter((r) => !liveResults.includes(r))
    .map((r) => PROVIDER_MODEL_MAP[r.providerName] ?? ("mock" as AiModel));

  const dimensions: CrossReviewDimension[] = [];

  for (const dim of RISK_DIMENSIONS) {
    const dimFindings = liveResults
      .map((r) => ({ result: r, finding: r.findings.find((f) => f.dimension === dim) }))
      .filter(
        (entry): entry is { result: ProviderResult; finding: InvestigationFinding } =>
          entry.finding !== undefined,
      );

    if (dimFindings.length === 0) continue;

    const votes: CrossReviewVote[] = dimFindings.map(({ result, finding }) => ({
      model: PROVIDER_MODEL_MAP[result.providerName] ?? ("mock" as AiModel),
      modelLabel: MODEL_LABELS[result.providerName] ?? result.providerName,
      score: finding.baseScore,
      grade: scoreToGrade(finding.baseScore),
    }));

    const consensusScore = Math.round(
      votes.reduce((sum, v) => sum + v.score, 0) / votes.length,
    );

    const gradeCounts = new Map<Grade, number>();
    for (const v of votes) {
      gradeCounts.set(v.grade, (gradeCounts.get(v.grade) ?? 0) + 1);
    }
    const maxCount = Math.max(...gradeCounts.values());
    const topGrades = [...gradeCounts.entries()]
      .filter(([, count]) => count === maxCount)
      .map(([grade]) => grade);

    let consensusGrade: Grade;
    let method: CrossReviewDimension["method"];
    if (votes.length === 1) {
      consensusGrade = votes[0].grade;
      method = "single";
    } else if (topGrades.length === 1 && maxCount === votes.length) {
      consensusGrade = topGrades[0];
      method = "unanimous";
    } else if (topGrades.length === 1) {
      consensusGrade = topGrades[0];
      method = "majority";
    } else {
      // タイ（多数決が決まらない）→ 安全側の最悪グレードを採用
      consensusGrade = topGrades.reduce((a, b) => worseGrade(a, b));
      method = "tie-break";
    }

    const hasAnyCGrade = votes.some((v) => v.grade === "C");
    const hasDisagreement =
      new Set(votes.map((v) => v.grade)).size > 1 || (hasAnyCGrade && consensusGrade !== "C");

    dimensions.push({
      dimension: dim,
      label: dimFindings[0].finding.label,
      votes,
      consensusScore,
      consensusGrade,
      method,
      hasDisagreement,
    });
  }

  const overallConsensusGrade = dimensions.reduce<Grade>(
    (acc, d) => worseGrade(acc, d.consensusGrade),
    "A",
  );

  const confidenceScore = calcAgreementRate(liveResults);
  const confidenceLevel: CrossReviewSummary["confidenceLevel"] =
    liveResults.length <= 1
      ? "低"
      : confidenceScore >= 80
        ? "高"
        : confidenceScore >= 50
          ? "中"
          : "低";

  return {
    dimensions,
    overallConsensusGrade,
    confidenceLevel,
    confidenceScore,
    participatingProviders,
    skippedProviders,
    isフォールバックOnly: usedフォールバック,
  };
}

/**
 * 「3つのAIによる統合評価」レポートを構築する。
 * 各AIの次元別判定を比較し、
 * - 全AIの判定が一致した次元 → 一致点（確信度高）
 * - 判定が割れた次元 → 不一致点（各AIの見解を両論併記）
 * として整理する。コンセンサスグレードは多数決（同数タイは安全側の最悪グレード）。
 * 参加プロバイダーは実API応答（live）のみを数える。全件フォールバック時は
 * 統合評価として成立しないため参加プロバイダーは空となる（UI側で非表示）。
 */
function buildIntegratedEvaluation(
  results: ProviderResult[],
  liveResults: ProviderResult[],
  usedフォールバック: boolean,
): IntegratedEvaluationSummary {
  const participatingProviders = liveResults.map(
    (r) => PROVIDER_MODEL_MAP[r.providerName] ?? ("mock" as AiModel),
  );
  const effectiveResults = usedフォールバック ? results : liveResults;

  const agreementPoints: IntegratedEvaluationPoint[] = [];
  const disagreementPoints: IntegratedEvaluationPoint[] = [];

  for (const dim of RISK_DIMENSIONS) {
    const dimFindings = effectiveResults
      .map((r) => ({ result: r, finding: r.findings.find((f) => f.dimension === dim) }))
      .filter(
        (entry): entry is { result: ProviderResult; finding: InvestigationFinding } =>
          entry.finding !== undefined,
      );

    if (dimFindings.length === 0) continue;

    const opinions = dimFindings.map(({ result, finding }) => ({
      model: PROVIDER_MODEL_MAP[result.providerName] ?? ("mock" as AiModel),
      modelLabel: MODEL_LABELS[result.providerName] ?? result.providerName,
      grade: scoreToGrade(finding.baseScore),
      score: finding.baseScore,
      rationale: finding.rationale,
    }));

    const isAgreement = new Set(opinions.map((o) => o.grade)).size === 1;

    // 多数決でコンセンサスを決定。同数タイの場合は安全側（最悪グレード）に倒す
    const gradeCounts = new Map<Grade, number>();
    for (const opinion of opinions) {
      gradeCounts.set(opinion.grade, (gradeCounts.get(opinion.grade) ?? 0) + 1);
    }
    const maxCount = Math.max(...gradeCounts.values());
    const topGrades = [...gradeCounts.entries()]
      .filter(([, count]) => count === maxCount)
      .map(([grade]) => grade);
    const consensusGrade =
      topGrades.length === 1 ? topGrades[0] : topGrades.reduce((a, b) => worseGrade(a, b));
    const consensusScore = Math.round(
      opinions.reduce((sum, o) => sum + o.score, 0) / opinions.length,
    );

    // 一致点の確信度: 3社一致なら「高」、2社一致なら「中」。不一致点は「低」
    const confidence: IntegratedEvaluationPoint["confidence"] = !isAgreement
      ? "低"
      : opinions.length >= 3
        ? "高"
        : "中";

    const point: IntegratedEvaluationPoint = {
      dimension: dim,
      label: dimFindings[0].finding.label,
      isAgreement,
      confidence,
      consensusGrade,
      consensusScore,
      opinions,
    };

    if (isAgreement) {
      agreementPoints.push(point);
    } else {
      disagreementPoints.push(point);
    }
  }

  const overallConsensusGrade = [...agreementPoints, ...disagreementPoints].reduce<Grade>(
    (acc, point) => worseGrade(acc, point.consensusGrade),
    "A",
  );

  const confidenceScore = calcAgreementRate(liveResults);
  const confidenceLevel: IntegratedEvaluationSummary["confidenceLevel"] =
    liveResults.length <= 1
      ? "低"
      : confidenceScore >= 80
        ? "高"
        : confidenceScore >= 50
          ? "中"
          : "低";

  return {
    title:
      liveResults.length >= 3
        ? "3つのAIによる統合評価"
        : liveResults.length >= 1
          ? `${liveResults.length}つのAIによる統合評価`
          : "3つのAIによる統合評価",
    participatingProviders,
    agreementPoints,
    disagreementPoints,
    overallConsensusGrade,
    confidenceLevel,
    confidenceScore,
    isフォールバックOnly: usedフォールバック,
  };
}

function buildAiProviders(): InvestigationProvider[] {
  const modelOrder = getEnabledAiModels();
  return modelOrder.map((model) => {
    if (model === "claude") return new ClaudeProvider();
    if (model === "gemini") return new GeminiProvider();
    return new OpenAIProvider();
  });
}

const INVESTIGATION_TOTAL_TIMEOUT_MS = Number(
  process.env.INVESTIGATION_TOTAL_TIMEOUT_MS ?? "55000",
);

/**
 * レポートナレーション生成(generateNarrative)に最低限確保する時間。
 * 調査フェーズ(3プロバイダー並列)が総予算をほぼ使い切った場合でも、
 * narrative呼び出しが即座にタイムアウトして毎回フォールバック文になって
 * しまわないよう、下限を設ける。環境変数で上書き可能。
 */
const NARRATIVE_MIN_TIMEOUT_MS = Number(
  process.env.NARRATIVE_MIN_TIMEOUT_MS ?? "12000",
);

/**
 * 個別プロバイダーのSDKタイムアウト(既定値: OPENAI_ANALYSIS_TIMEOUT_MS等、
 * デフォルト45秒。src/lib/ai/config.tsのTIMEOUT_DEFAULTS.analysis参照)が
 * 何らかの理由で機能しなかった場合の保険として、調査全体の上限時間
 * （デフォルト55秒）で強制的に失敗させる。
 *
 * 重要: INVESTIGATION_TOTAL_TIMEOUT_MSは「3プロバイダー並列調査」と
 * 「その後直列実行されるnarrative生成」を合わせた"調査エンドツーエンドの
 * 総予算"である。この関数はまず調査フェーズ(withOverallTimeout(provider.run(...),
 * INVESTIGATION_TOTAL_TIMEOUT_MS))に適用され、narrative呼び出しには
 * 「総予算 - 調査フェーズの実経過時間」を残り予算として別途 withOverallTimeout で
 * 適用する（runInvestigation内を参照）。
 *
 * 各値の大小関係は必ず以下を維持すること。崩れると内側のタイムアウトが
 * 機能する前に外側が先に切れてしまい、個別設定が意味を失う。
 *   個別プロバイダーanalysisタイムアウト(45s)
 *     < 調査エンドツーエンド総予算 INVESTIGATION_TOTAL_TIMEOUT_MS(55s)
 *     < Vercelのmaxduration(60s、src/app/api/investigations/[id]/run/route.ts参照)
 *
 * 55s(総予算) と 60s(maxDuration) の差5秒は、DB保存・チェックリスト生成等
 * AI呼び出し以外の処理時間のためのバッファ。
 */
function withOverallTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`investigation timed out after ${ms}ms`)), ms);
    }),
  ]);
}

export async function runInvestigation(caseId: string, userEmail: string) {
  const investigationStartedAt = Date.now();
  const detail = await assertCaseOwner(caseId, userEmail);

  if (!detail) {
    return null;
  }

  await updateInvestigationStatus(caseId, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    // ENABLED_AI_PROVIDERS の順序で有効なAIプロバイダーを並列実行（部分成功対応、全体タイムアウト付き）
    const aiProviders = buildAiProviders();
    const settled = await Promise.allSettled(
      aiProviders.map((provider) =>
        withOverallTimeout(provider.run(detail.case), INVESTIGATION_TOTAL_TIMEOUT_MS),
      ),
    );

    const results = settled
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<ProviderResult>).value);

    const failedProviders = settled
      .map((result, index) => ({ result, name: aiProviders[index].constructor.name }))
      .filter((entry) => entry.result.status === "rejected")
      .map((entry) => entry.name);

    if (failedProviders.length > 0) {
      console.warn(`[orchestrator] Failed providers: ${failedProviders.join(", ")}`);
    }

    if (results.length === 0) {
      throw new Error("全てのAIプロバイダーが応答に失敗しました。");
    }

    // 実APIキーが有効なプロバイダーのみを抽出。1件以上あればそれらのみで集計し、
    // キー未設定/無効なプロバイダーは自動的にスキップする。全件フォールバックの場合は
    // 従来通り全結果（mock含む）を使用する。
    const liveResults = results.filter((r) => r.providerStatus === "live");
    const usedフォールバック = liveResults.length === 0;
    const effectiveResults = usedフォールバック ? results : liveResults;

    // モデル別結果（UI比較表示用、全プロバイダーを表示しフォールバック中である旨も可視化）
    const modelResults = buildModelResults(results);

    // 次元ごとに集約（最悪ケースのスコアで統一、公式グレードは無変更）
    const findings: InvestigationFinding[] = aggregateFindings(effectiveResults);
    const dimensions = buildDimensionScores(findings);
    const summary = buildScoreSummary(dimensions);
    const evidence = collectEvidence(effectiveResults);

    // 平均リスクスコア
    const avgScore = dimensions.length > 0
      ? Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length)
      : 50;

    // 新集約フィールド（利用可能なプロバイダーのみを対象に算出）
    const agreementRate = calcAgreementRate(effectiveResults);
    const reviewMeeting = buildReviewMeeting(results);
    const improvementSteps = buildImprovementSteps(effectiveResults, avgScore);
    const worstCaseScenarios = buildWorstCaseScenarios(effectiveResults);
    const disagreementDimensions = findDisagreementDimensions(effectiveResults);

    // マルチAIコンセンサス（多数決/重み付け集計、参考情報として公式グレードとは別に保持）
    const crossReview = buildCrossReview(results, effectiveResults, usedフォールバック);

    // 「3つのAIによる統合評価」レポート（一致点=確信度高、不一致点=両論併記）
    const integratedEvaluation = buildIntegratedEvaluation(
      results,
      liveResults,
      usedフォールバック,
    );

    // レポートナレーション生成（OpenAI APIキーがあれば実API呼び出し、なければテンプレートにフォールバック）
    // 注意: 上のPromise.allSettledによる各プロバイダー調査は並列実行だが、
    // このnarrative生成は直列で「その後」に実行される。そのためnarrative呼び出し自体にも
    // 調査開始時刻からの残り予算でタイムアウトを掛け、調査+narrativeの合計が
    // INVESTIGATION_TOTAL_TIMEOUT_MSおよびmaxDuration=60を超えないようにする。
    // 残り予算が極端に短い場合でも最低NARRATIVE_MIN_TIMEOUT_MSは確保し、
    // 即時タイムアウトによる無駄な失敗を避ける。
    const elapsedMs = Date.now() - investigationStartedAt;
    const remainingBudgetMs = INVESTIGATION_TOTAL_TIMEOUT_MS - elapsedMs;
    const narrativeTimeoutMs = Math.max(remainingBudgetMs, NARRATIVE_MIN_TIMEOUT_MS);
    const reportNarrative = await withOverallTimeout(
      generateNarrative({
        productName: detail.case.productName,
        destinationCountry: detail.case.destinationCountry,
        customerCompanyName: detail.case.customerCompanyName,
        overallGrade: summary.overall,
        highlights: dimensions
          .filter((item) => item.grade !== "A")
          .slice(0, 3)
          .map((item) => item.label),
      }),
      narrativeTimeoutMs,
    ).catch((error) => {
      console.warn(
        `[orchestrator] narrative生成が残り予算(${narrativeTimeoutMs}ms)内に完了しませんでした。フォールバック文を使用します。`,
        error,
      );
      return buildフォールバックNarrative({
        productName: detail.case.productName,
        destinationCountry: detail.case.destinationCountry,
        customerCompanyName: detail.case.customerCompanyName,
        overallGrade: summary.overall,
        highlights: dimensions
          .filter((item) => item.grade !== "A")
          .slice(0, 3)
          .map((item) => item.label),
      });
    });

    const now = new Date().toISOString();
    const assessment: AssessmentRecord = {
      caseId,
      summary,
      dimensions,
      evidence,
      reportNarrative,
      modelResults,
      agreementRate,
      reviewMeeting,
      improvementSteps,
      worstCaseScenarios,
      disagreementDimensions,
      crossReview,
      integratedEvaluation,
      regulationUpdates: getRegulationUpdatesForCase({
        destinationCountry: detail.case.destinationCountry,
        productName: detail.case.productName,
      }),
      createdAt: detail.assessment?.createdAt ?? now,
      updatedAt: now,
    };

    await saveAssessment(assessment);

    const generatedChecklist = buildChecklistFromAssessment({
      caseRecord: detail.case,
      dimensions,
      evidence,
      nextActions: summary.nextActions,
    });
    await replaceCaseChecklist(
      caseId,
      mergeChecklistItems(detail.case.checklist, generatedChecklist),
    );
    await updateInvestigationStatus(caseId, {
      status: "completed",
      completedAt: now,
    });

    return getCaseDetail(caseId);
  } catch (error) {
    await updateInvestigationStatus(caseId, {
      status: "failed",
      errorMessage:
        error instanceof Error
          ? error.message
          : "調査中に予期しないエラーが発生しました。",
    });
    return getCaseDetail(caseId);
  }
}
