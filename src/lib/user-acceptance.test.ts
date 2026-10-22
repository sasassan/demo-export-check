import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const fixturePath = join(process.cwd(), "tests/fixtures/export-risk-user-scenarios.csv");
const expectedIds = Array.from({ length: 30 }, (_, i) => `S${String(i + 1).padStart(2, "0")}`);
const releaseBlockers = ["S04", "S06", "S07", "S13", "S16", "S17", "S18", "S19", "S25", "S26", "S27", "S28"];

test("real-user acceptance fixtures have 30 unique, ordered scenarios", () => {
  const lines = readFileSync(fixturePath, "utf8").trim().split(/\r?\n/);
  assert.equal(lines[0], "id,category,scenario,input_condition,expected_behavior");
  assert.equal(lines.length, 31);
  const ids = lines.slice(1).map((line) => {
    const match = /^"(S\d{2})",/.exec(line);
    assert.ok(match, `Malformed scenario: ${line}`);
    return match[1];
  });
  assert.deepEqual(ids, expectedIds);
});

test("critical release-blocking scenarios are present", () => {
  const contents = readFileSync(fixturePath, "utf8");
  for (const id of releaseBlockers) {
    assert.match(contents, new RegExp(`^"${id}",`, "m"));
  }
});
