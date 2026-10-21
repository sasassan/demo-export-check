import assert from "node:assert/strict";
import test from "node:test";
import { triageAssessment } from "./decision";
import { assessEvidenceFreshness } from "./evidence";

const base = {
  subjectId: "case-1",
  checkedAt: "2026-10-21T00:00:00Z",
  evidence: [],
  findings: [],
  requiredChecks: ["end-user", "end-use", "sanctions"],
  completedChecks: ["end-user", "end-use", "sanctions"],
};
test("completed checks without findings are A, but never authorization", () => {
  const result = triageAssessment(base);
  assert.equal(result.grade, "A");
  assert.equal(result.authorization, false);
});
test("missing mandatory checks require review", () => {
  assert.equal(triageAssessment({ ...base, completedChecks: [] }).grade, "B");
});
test("critical finding overrides missing evidence", () => {
  const result = triageAssessment({ ...base, findings: [{ code: "SANCTION", severity: "critical", explanation: "Potential match", evidenceIds: [] }] });
  assert.equal(result.grade, "C");
  assert.deepEqual(result.unsupportedFindings, ["SANCTION"]);
});
test("unsupported informational finding requires review", () => {
  assert.equal(triageAssessment({ ...base, findings: [{ code: "X", severity: "info", explanation: "Claim", evidenceIds: ["unknown"] }] }).grade, "B");
});
test("stale and future evidence cannot be called current", () => {
  const evidence = { id: "e", sourceName: "Official", sourceUrl: "https://example.org", retrievedAt: "2026-10-01T00:00:00Z", excerpt: "", jurisdiction: "JP", matchType: "exact" as const };
  assert.equal(assessEvidenceFreshness(evidence, new Date("2026-10-21T00:00:00Z")).current, false);
  assert.equal(assessEvidenceFreshness({ ...evidence, retrievedAt: "2026-10-22T00:00:00Z" }, new Date("2026-10-21T00:00:00Z")).current, false);
});
