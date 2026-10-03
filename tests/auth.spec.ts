import { expect, test } from "@playwright/test";

import { mockLoginFlow } from "./helpers/auth";

test.describe("ログインフロー", () => {
  test("OTP送信→コード検証でログインしてダッシュボードへ遷移できる", async ({ page }) => {
    await mockLoginFlow(page);

    await page.goto("/login");
    await page.getByLabel("メールアドレス").fill("e2e-login@example.com");
    await page.getByRole("button", { name: "確認コードを送信" }).click();

    // OTPコード入力フォームが表示される
    const codeInput = page.getByLabel("確認コード（6桁）");
    await expect(codeInput).toBeVisible();
    await codeInput.fill("123456");
    await page
      .getByRole("button", { name: "コードを確認してログイン" })
      .click();

    // 認証後にダッシュボードへ遷移
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "案件一覧" }),
    ).toBeVisible();
  });

  test("未認証でダッシュボードへアクセスするとログインへリダイレクトされる", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("button", { name: "確認コードを送信" }),
    ).toBeVisible();
  });
});
