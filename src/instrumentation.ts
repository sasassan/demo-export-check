import * as Sentry from "@sentry/nextjs";

/**
 * Next.js instrumentation hook — Sentry初期化 + サーバー起動時のDB自動マイグレーション。
 *
 * Sentry:
 * - ランタイムごとに該当する設定ファイルを読み込み、Sentry.init を実行する。
 *   （Node.js → sentry.server.config / Edge → sentry.edge.config）
 * - onRequestError は Server Components / Route Handlers / Server Actions /
 *   Proxy で捕捉されたエラーを Sentry に送信する。
 *
 * DBマイグレーション:
 * - Next.js 16 では src/instrumentation.ts に register を export すると、
 *   サーバー起動時に一度だけ呼ばれる（config フラグは不要）。
 * - Node.js ランタイムのみで実行する（postgres ドライバは Edge で動作しないため）。
 * - DATABASE_URL が未設定（E2EテストのインメモリDBモード等）の場合はスキップ。
 * - 適用済みかどうかは drizzle-orm の __drizzle_migrations ジャーナルで管理され、
 *   起動のたびに実行しても冪等。
 * - 失敗時はログ出力のみで、アプリの起動はブロックしない。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }

  // DB自動マイグレーションは Node.js ランタイムのみで実行する。
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

/** Next.js がサーバー側で捕捉したエラーを Sentry へ送信する。 */
export const onRequestError = Sentry.captureRequestError;
