import type { Page } from "@playwright/test";

/**
 * E2Eテスト専用の固定シークレット。
 * playwright.config.ts の webServer.env と共有し、アプリ側（別プロセス）が
 * 発行・検証するセッションCookieのHMAC署名と一致させる。
 * 実運用のシークレットではなく、テスト用にのみ使用する公開固定値。
 */
export const SESSION_SECRET = "e2e-test-session-secret";
export const SESSION_COOKIE_NAME = "ern_session_email";

export const TEST_USER_EMAIL = "e2e-user@example.com";
export const ADMIN_EMAIL = "e2e-admin@example.com";

/** セッションCookie値 `{email}.{base64url(HMAC-SHA256(secret, email))}` を生成する。 */
export async function signSessionValue(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(email));
  return `${email}.${Buffer.from(signature).toString("base64url")}`;
}

/**
 * サーバ側で検証可能なセッションCookieをブラウザに注入して認証状態を確立する。
 * UIログインを模擬するのではなく、認証状態そのものをテスト用に用意する。
 */
export async function authenticate(
  page: Page,
  email: string = TEST_USER_EMAIL,
): Promise<void> {
  const value = await signSessionValue(email);
  await page.context().addCookies([
    {
      name: SESSION_COOKIE_NAME,
      value,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

/**
 * ログインフロー（/api/auth/login → /api/auth/verify）をモックする。
 * メール送信やOTPの実発行は行わず、検証APIでテスト用セッションCookieを返す。
 */
export async function mockLoginFlow(page: Page): Promise<void> {
  await page.route("**/api/auth/login", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ verificationRequired: true }),
    }),
  );

  await page.route("**/api/auth/verify", async (route) => {
    const body = route.request().postDataJSON() as { email?: string };
    const email = (body.email ?? TEST_USER_EMAIL).trim().toLowerCase();
    const value = await signSessionValue(email);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Set-Cookie": `${SESSION_COOKIE_NAME}=${value}; Path=/; SameSite=Lax`,
      },
      body: JSON.stringify({ ok: true }),
    });
  });
}
