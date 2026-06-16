import { scoreToGrade, maxGrade } from "@/lib/risk/rules";
import { toTitleGradeLabel } from "@/lib/utils";
import type {
  DimensionScore,
  InvestigationFinding,
  ScoreSummary,
} from "@/lib/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
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
  const overall = maxGrade(dimensions.map((item) => item.grade));
  const security = maxGrade([
    gradeMap.get("sanctions") ?? "A",
    gradeMap.get("endUser") ?? "A",
    gradeMap.get("catchAll") ?? "A",
    gradeMap.get("useCase") ?? "A",
  ]);
  const credit = maxGrade([
    gradeMap.get("ubo") ?? "A",
    gradeMap.get("peps") ?? "A",
    gradeMap.get("reputation") ?? "A",
  ]);
  const logistics = maxGrade([
    gradeMap.get("country") ?? "A",
    gradeMap.get("reputation") ?? "A",
  ]);
  const country = gradeMap.get("country") ?? "A";
  const averageScore = average(dimensions.map((item) => item.score));

  return {
    overall,
    security,
    credit,
    logistics,
    country,
    headline: `総合評価 ${overall}（平均スコア ${averageScore} 点）`,
    summary: `現在の案件は ${toTitleGradeLabel(overall)} に分類されます。重大な論点は ${toTitleGradeLabel(
      security,
    )} の安全保障リスクと、${toTitleGradeLabel(country)} の国別リスクです。`,
    nextActions: dimensions
      .filter((item) => item.grade !== "A")
      .slice(0, 3)
      .map((item) => item.recommendedAction),
  };
}