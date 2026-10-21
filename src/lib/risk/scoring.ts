import { scoreToGrade, maxGrade } from "@/lib/risk/rules";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { toTitleGradeLabel } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import type {
  DimensionScore,
  Grade,
  InvestigationFinding,
  ScoreSummary,
} from "@/lib/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/**
 * 調査カバレッジと、未調査項目を除外しない総合評価・スコアを計算する。
 *
 * - overall: 必須調査項目が未完了の場合は「要確認」(B)。ただし調査済み項目に
 *   C（高リスク）が存在する場合は C を優先する。
 * - averageRiskScore: 調査済み項目のみの平均リスクスコア。未調査項目を除外した
 *   この平均値を「総合安全スコア」として表示してはならない。
 */
export type SafetyScoreBreakdown = {
  overall: Grade;
  missing: RiskDimension[];
  investigatedCount: number;
  totalCount: number;
  missingCount: number;
  averageRiskScore: number;
  safetyScore: number;
  isComplete: boolean;
};

export function computeSafetyScore(dimensions: DimensionScore[]): SafetyScoreBreakdown {
  const gradeMap = new Map(dimensions.map((item) => [item.dimension, item.grade]));
  const missing = RISK_DIMENSIONS.filter((dimension) => !gradeMap.has(dimension));
  const overall = maxGrade([
    ...dimensions.map((item) => item.grade),
    ...(missing.length > 0 ? (["B"] as const) : []),
  ]);
  const averageRiskScore = average(dimensions.map((item) => item.score));

  return {
    overall,
    missing,
    investigatedCount: dimensions.length,
    totalCount: RISK_DIMENSIONS.length,
    missingCount: missing.length,
    averageRiskScore,
    safetyScore: Math.max(0, 100 - averageRiskScore),
    isComplete: missing.length === 0,
  };
}

export function buildDimensionScores(findings: InvestigationFinding[]): DimensionScore[] {
  return findings.map((finding) => ({
    dimension: finding.dimension,
    label: finding.label,
    score: finding.baseScore,
    grade: scoreToGrade(finding.baseScore),
    rationale: finding.rationale,
    recommendedAction: finding.recommendedAction,
  }));
}

export function buildScoreSummary(dimensions: DimensionScore[]): ScoreSummary {
  const gradeMap = new Map(dimensions.map((item) => [item.dimension, item.grade]));
  // 未調査の必須項目を低リスク(A)として扱わない。総合評価・未調査判定は
  // computeSafetyScore に集約し、スコア計算を一元化する。
  const { overall, missing, averageRiskScore } = computeSafetyScore(dimensions);
  const security = maxGrade([
    gradeMap.get("sanctions") ?? "B",
    gradeMap.get("endUser") ?? "B",
    gradeMap.get("catchAll") ?? "B",
    gradeMap.get("useCase") ?? "B",
  ]);
  const credit = maxGrade([
    gradeMap.get("ubo") ?? "B",
    gradeMap.get("peps") ?? "B",
    gradeMap.get("reputation") ?? "B",
  ]);
  const logistics = maxGrade([
    gradeMap.get("country") ?? "B",
    gradeMap.get("reputation") ?? "B",
  ]);
  const country = gradeMap.get("country") ?? "B";

  return {
    overall,
    security,
    credit,
    logistics,
    country,
    headline:
      missing.length > 0
        ? `総合評価 ${overall}（未調査 ${missing.length} 項目あり）`
        : `総合評価 ${overall}（平均スコア ${averageRiskScore} 点）`,
    summary: `現在の案件は ${toTitleGradeLabel(overall)} に分類されます。重大な論点は ${toTitleGradeLabel(
      security,
    )} の安全保障リスクと、${toTitleGradeLabel(country)} の国別リスクです。`,
    nextActions: [
      ...missing.map((dimension) => `未調査項目（${dimension}）を確認する`),
      ...dimensions
      .filter((item) => item.grade !== "A")
      .slice(0, 3)
      .map((item) => item.recommendedAction),
    ].slice(0, 3),
  };
}
