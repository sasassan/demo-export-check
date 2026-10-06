/**
 * 本番デプロイ時にDBスキーマを適用するプリビルドスクリプト。
 *
 * - Vercelの本番ビルドでは環境変数 DATABASE_URL が注入されるため、
 *   drizzle-kit push で drizzle/ 配下のマイグレーション相当のスキーマ差分を適用する。
 * - ローカルビルドや DATABASE_URL が無い環境ではスキップし、ビルドを妨げない。
 * - --force は付けないため、データ損失を伴う差分（カラム削除等）がある場合は
 *   ビルドが失敗し、本番データが保護される。
 */
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgres")) {
  console.log(
    "[apply-prod-migrations] DATABASE_URL is not set (local build) — skipping DB schema sync."
  );
  process.exit(0);
}

console.log("[apply-prod-migrations] DATABASE_URL detected — running drizzle-kit push…");
execSync("drizzle-kit push", { stdio: "inherit" });
console.log("[apply-prod-migrations] done.");
