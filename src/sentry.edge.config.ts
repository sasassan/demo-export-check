import * as Sentry from "@sentry/nextjs";

/**
 * Sentry SDK 初期化（Edge ランタイム）。
 * Node.js サーバー版と同様、PII・Cookie・本文の収集を無効化する。
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
    stackFrameVariables: false,
  },
});
