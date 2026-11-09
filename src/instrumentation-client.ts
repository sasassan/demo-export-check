import * as Sentry from "@sentry/nextjs";

/**
 * Sentry SDK 初期化（ブラウザ/クライアント）。
 *
 * クライアント側の DSN は Next.js がビルド時にインライン化できるよう
 * `NEXT_PUBLIC_SENTRY_DSN` を使用する（サーバー側の `SENTRY_DSN` とは別名）。
 * どちらも同じ DSN 値を設定すること。
 *
 * このファイル名（`instrumentation-client.ts`）は Sentry v11 + Turbopack の
 * クライアント設定の推奨配置で、`withSentryConfig` がビルド時に自動注入する。
 * （旧名称 `sentry.client.config.ts` は v11 で非推奨となり、Turbopack では機能しない。）
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  dataCollection: {
    userInfo: false,
    cookies: false,
    httpBodies: [],
    stackFrameVariables: false,
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
