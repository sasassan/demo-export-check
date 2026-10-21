import assert from "node:assert/strict";
import { test } from "node:test";

import { buildScoreSummary } from "./scoring";
import type { RiskDimension } from "@/lib/constants";
import type { DimensionScore } from "@/lib/types";

const ALL_DIMENSIONS: RiskDimension[] = [
  "sanctions",
  "endUser",
  "ubo",
  "peps",
  "country",
  "useCase",
  "catchAll",
  "reputation",
];

function dim(
  dimension: RiskDimension,
  grade: "A" | "B" | "C",
  score = 0,
): DimensionScore {
  return {
    dimension,
    label: dimension,
    score,
    grade,
    rationale: "根拠",
    recommendedAction: `推奨: ${dimension}を確認`,
  };
}

test("buildScoreSummary: 未調査の必須項目がある場合は総合評価がAにならない", () => {
  const summary = buildScoreSummary([dim("sanctions", "A", 0)]);
  assert.notEqual(summary.overall, "A");
  assert.equal(summary.overall, "B");
});

test("buildScoreSummary: 必須8次元が揃い全てAなら総合評価A", () => {
  const summary = buildScoreSummary(ALL_DIMENSIONS.map((d) => dim(d, "A", 0)));
  assert.equal(summary.overall, "A");
});

test("buildScoreSummary: 実在するCリスクがあれば総合評価C", () => {
  const dimensions = ALL_DIMENSIONS.map((d) => dim(d, "A", 0));
  dimensions[4] = dim("country", "C", 85);
  const summary = buildScoreSummary(dimensions);
  assert.equal(summary.overall, "C");
  assert.equal(summary.country, "C");
});

test("buildScoreSummary: 未調査項目と高リスク項目を区別して提示する", () => {
  const missingSummary = buildScoreSummary([dim("sanctions", "A", 0)]);
  assert.ok(missingSummary.nextActions.some((action) => action.includes("未調査項目")));

  const highRisk = ALL_DIMENSIONS.map((d) => dim(d, "A", 0));
  highRisk[4] = dim("country", "C", 85);
  const highRiskSummary = buildScoreSummary(highRisk);
  assert.ok(highRiskSummary.nextActions.some((action) => action.includes("country")));
  assert.ok(!highRiskSummary.nextActions.some((action) => action.includes("未調査項目")));
});

test("buildScoreSummary: 未調査がある場合のheadlineは未調査件数を示す", () => {
  const summary = buildScoreSummary([dim("sanctions", "A", 0), dim("country", "A", 0)]);
  assert.ok(summary.headline.includes("未調査"));
});

test("buildScoreSummary: 未調査がない場合のheadlineは平均スコアを示す", () => {
  const summary = buildScoreSummary(ALL_DIMENSIONS.map((d) => dim(d, "A", 20)));
  assert.ok(summary.headline.includes("平均スコア"));
});
