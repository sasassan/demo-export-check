import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const page = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");

test("LP does not promise an unverified five-minute AI decision", () => {
  assert.doesNotMatch(page, /AIが5分で/);
  assert.doesNotMatch(page, /平均確認時間", "約5分"/);
});

test("LP explains human verification for legal compliance", () => {
  assert.match(page, /最終判断は担当者が行います/);
  assert.match(page, /最終判断には専門家の確認が必要です/);
});

test("LP distinguishes planned UBO and PEPs research from completed screening", () => {
  assert.match(page, /UBO.*PEPs.*今後の拡充項目/);
});

test("LP does not claim 24-hour live monitoring", () => {
  assert.doesNotMatch(page, /24時間モニタリング/);
});
