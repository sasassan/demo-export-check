import { defineConfig, devices } from "@playwright/test";

import {
  ADMIN_EMAIL,
  SESSION_COOKIE_NAME,
  SESSION_SECRET,
} from "./tests/helpers/auth";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2Eテスト用のPlaywright設定。
 *
 * - webServer で `next dev` を起動するため、開発サーバーを別途起動する必要はない。
 * - 認証は tests/helpers/auth.ts の authenticate() でサーバ検証可能なセッションCookieを
 *   注入する。webServer.env に同一の SESSION_SECRET / SESSION_COOKIE_NAME / ADMIN_EMAILS
 *   を渡すことで、アプリ側（別プロセス）と署名・管理者判定を一致させる。
 * - DATABASE_URL を空文字にすることで .env.local のDB接続先を上書きし、
 *   インメモリDBフォールバック（repository.ts の getState()）で動作させる。
 *   テストデータはUI経由でのみ作成し、実DBには一切触れない。
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // 単一の開発サーバー＋インメモリ共有状態を扱うため、決定的な実行を優先して直列化する。
  workers: 1,
  // next dev の初回オンデマンドコンパイルに余裕を持たせる。
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      testMatch: /responsive\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      SESSION_SECRET,
      SESSION_COOKIE_NAME,
      ADMIN_EMAILS: ADMIN_EMAIL,
      DATABASE_URL: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
