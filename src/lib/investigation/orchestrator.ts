import { buildChecklistFromAssessment } from "@/lib/checklist/generator";
import { mergeChecklistItems } from "@/lib/checklist/merge";
import { generateNarrative } from "@/lib/providers/openai";
import { OpenAIProvider } from "@/lib/providers/openai-provider";
import { ClaudeProvider } from "@/lib/providers/claude-provider";
import { GeminiProvider } from "@/lib/providers/gemini-provider";
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
} from "@/lib/types";
import { scoreToGrade } from "@/lib/risk/rules";
import { RISK_DIMENSIONS, type RiskDimension } from "@/lib/constants";
import { getRegulationUpdatesForCase } from "@/lib/regulation-updates";

const MODEL_LABELS: Record<string, string> = {
  "openai-gpt4o": "GPT-4o",
  "anthropic-claude": "Claude",
  "google-gemini": "Gemini",
};

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

const aiProviders = [
  new OpenAIProvider(),
  new ClaudeProvider(),
  new GeminiProvider(),
];

export async function runInvestigation(caseId: string, userEmail: string) {
  const detail = await assertCaseOwner(caseId, userEmail);

  if (!detail) {
    return null;
  }

  await updateInvestigationStatus(caseId, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    // 3つのAIプロバイダーを並列実行（部分成功対応）
    const settled = await Promise.allSettled(
      aiProviders.map((provider) => provider.run(detail.case)),
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

    // モデル別結果（UI比較表示用）
    const modelResults = buildModelResults(results);

    // 次元ごとに集約（最悪ケードスコアで統一）
    const findings: InvestigationFinding[] = aggregateFindings(results);
    const dimensions = buildDimensionScores(findings);
    const summary = buildScoreSummary(dimensions);
    const evidence = collectEvidence(results);

    // 平均リスクスコア
    const avgScore = dimensions.length > 0
      ? Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length)
      : 50;

    // 新集約フィールド
    const agreementRate = calcAgreementRate(results);
    const reviewMeeting = buildReviewMeeting(results);
    const improvementSteps = buildImprovementSteps(results, avgScore);
    const worstCaseScenarios = buildWorstCaseScenarios(results);
    const disagreementDimensions = findDisagreementDimensions(results);

    // レポートナレーション生成（OpenAI APIキーがあれば実行、なければモック）
    const reportNarrative = await generateNarrative({
      productName: detail.case.productName,
      destinationCountry: detail.case.destinationCountry,
      customerCompanyName: detail.case.customerCompanyName,
      overallGrade: summary.overall,
      highlights: dimensions
        .filter((item) => item.grade !== "A")
        .slice(0, 3)
        .map((item) => item.label),
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
