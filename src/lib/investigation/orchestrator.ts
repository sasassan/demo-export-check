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
} from "@/lib/types";
import { scoreToGrade } from "@/lib/risk/rules";
import { RISK_DIMENSIONS, type RiskDimension } from "@/lib/constants";

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

    return { model, modelLabel, dimensions };
  });
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
    // 3つのAIプロバイダーを並列実行
    const results = await Promise.all(
      aiProviders.map((provider) => provider.run(detail.case)),
    );

    // モデル別結果（UI比較表示用）
    const modelResults = buildModelResults(results);

    // 次元ごとに集約（最悪ケードスコアで統一）
    const findings: InvestigationFinding[] = aggregateFindings(results);
    const dimensions = buildDimensionScores(findings);
    const summary = buildScoreSummary(dimensions);
    const evidence = collectEvidence(results);

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
