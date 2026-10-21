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
  // 未調査の必須項目を低リスク(A)として扱わない。
  const required = ["sanctions", "endUser", "catchAll", "useCase", "ubo", "peps", "reputation", "country"] as const;
  const missing = required.filter((dimension) => !gradeMap.has(dimension));
  const overall = maxGrade([...dimensions.map((item) => item.grade), ...(missing.length ? ["B" as const] : [])]);
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
    nextActions: [
      ...missing.map((dimension) => `未調査項目（${dimension}）を確認する`),
      ...dimensions
      .filter((item) => item.grade !== "A")
      .slice(0, 3)
      .map((item) => item.recommendedAction),
    ].slice(0, 3),
  };
}