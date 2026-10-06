/**
 * Next.js instrumentation hook — サーバー起動時にDBマイグレーションを自動適用する。
 *
 * - Next.js 16 では src/instrumentation.ts に register を export すると、
 *   サーバー起動時に一度だけ呼ばれる（config フラグは不要）。
 * - Node.js ランタイムのみで実行する（postgres ドライバは Edge で動作しないため）。
 * - DATABASE_URL が未設定（E2EテストのインメモリDBモード等）の場合はスキップ。
 * - 適用済みかどうかは drizzle-orm の __drizzle_migrations ジャーナルで管理され、
 *   起動のたびに実行しても冪等。
 * - 失敗時はログ出力のみで、アプリの起動はブロックしない。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log("[db-migrations] DATABASE_URL is not set — skipping auto migration.");
    return;
  }

  try {
    const { runMigrations } = await import("@/lib/db/migrate");
    await runMigrations();
    console.log("[db-migrations] applied.");
  } catch (error) {
    console.error("[db-migrations] failed (non-blocking):", error);
  }
}
