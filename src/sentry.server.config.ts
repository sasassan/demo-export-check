import * as Sentry from "@sentry/nextjs";

/**
 * Sentry SDK 初期化（Node.js サーバーランタイム）。
 * DSN は環境変数 SENTRY_DSN から取得する（値そのものはコミットしない）。
 *
 * 本アプリは輸出管理の法令判断という機密性の高いデータを扱うため、
 * v11 で既定有効になった PII・認証情報・AI入出力・DBクエリデータ・
 * リクエスト/レスポンス本文の収集を明示的に無効化する。
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 本番は10%、開発は100%のトレースを収集する。
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  dataCollection: {
    // IPアドレス等の利用者識別情報を送信しない。
    userInfo: false,
    // セッションCookie等の送信を禁止する。
    cookies: false,
    // リクエスト/レスポンス本文（輸出管理の機密文書を含み得る）を送信しない。
    httpBodies: [],
    // AIプロンプト/回答（法令判断の入力・出力）を送信しない。
    genAI: { inputs: false, outputs: false },
    // DBクエリのバインド値・結果データを送信しない。
    databaseQueryData: false,
    // スタックフレームのローカル変数値（秘密鍵等を含み得る）を送信しない。
    stackFrameVariables: false,
  },
});
