import assert from "node:assert/strict";
import { test } from "node:test";

import { buildScoreSummary, computeSafetyScore } from "./scoring";
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

test("computeSafetyScore: 全項目調査済み・全Aなら正常表示（complete）", () => {
  const s = computeSafetyScore(ALL_DIMENSIONS.map((d) => dim(d, "A", 0)));
  assert.equal(s.overall, "A");
  assert.equal(s.isComplete, true);
  assert.equal(s.investigatedCount, 8);
  assert.equal(s.totalCount, 8);
  assert.equal(s.missingCount, 0);
  assert.equal(s.averageRiskScore, 0);
  assert.equal(s.safetyScore, 100);
});

test("computeSafetyScore: 一部未調査・リスクなしなら「要確認」", () => {
  const s = computeSafetyScore([dim("sanctions", "A", 0), dim("country", "A", 0)]);
  assert.equal(s.overall, "B");
  assert.equal(s.isComplete, false);
  assert.equal(s.investigatedCount, 2);
  assert.equal(s.missingCount, 6);
});

test("computeSafetyScore: 一部未調査でもC判定があれば高リスクを優先", () => {
  const s = computeSafetyScore([dim("sanctions", "C", 85)]);
  assert.equal(s.overall, "C");
  assert.equal(s.isComplete, false);
  assert.equal(s.missingCount, 7);
});

test("computeSafetyScore: 全項目未調査なら「要確認」", () => {
  const s = computeSafetyScore([]);
  assert.equal(s.overall, "B");
  assert.equal(s.isComplete, false);
  assert.equal(s.investigatedCount, 0);
  assert.equal(s.totalCount, 8);
  assert.equal(s.missingCount, 8);
  assert.equal(s.averageRiskScore, 0);
});

test("computeSafetyScore: 1項目のみ調査済みでも平均を正常計算", () => {
  const s = computeSafetyScore([dim("sanctions", "B", 55)]);
  assert.equal(s.investigatedCount, 1);
  assert.equal(s.missingCount, 7);
  assert.equal(s.averageRiskScore, 55);
  assert.equal(s.safetyScore, 45);
  assert.equal(s.isComplete, false);
});
