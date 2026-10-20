import { expect, test } from "@playwright/test";

import { ADMIN_EMAIL, authenticate, mockLoginFlow } from "./helpers/auth";

test.describe("管理画面アクセス制御", () => {
  test("管理者ユーザーは管理画面を表示できる", async ({ page }) => {
    await authenticate(page, ADMIN_EMAIL);

    await page.goto("/admin/monitoring");
    await expect(
      page.getByRole("heading", { level: 1, name: "管理者モニタリング" }),
    ).toBeVisible();
  });

  test("非管理者ユーザーはダッシュボードへリダイレクトされる", async ({ page }) => {
    await authenticate(page, "e2e-user@example.com");

    await page.goto("/admin/monitoring");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("未認証ユーザーはログインへリダイレクトされる", async ({ page }) => {
    await page.goto("/admin/monitoring");
    // ログイン後に元の管理者パスへ戻れるよう ?next= が付与される。
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fmonitoring$/);
  });

  test("未認証で /admin/analytics にアクセス→ログイン後に元のパスへ戻る", async ({ page }) => {
    await mockLoginFlow(page);

    await page.goto("/admin/analytics");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin%2Fanalytics$/);

    await page.getByLabel("メールアドレス").fill(ADMIN_EMAIL);
    await page.getByRole("button", { name: "確認コードを送信" }).click();
    await page.getByLabel("確認コード（6桁）").fill("123456");
    await page
      .getByRole("button", { name: "コードを確認してログイン" })
      .click();

    // URL は /admin/analytics のまま維持され、アクセス分析ダッシュボードが表示される。
    await expect(page).toHaveURL(/\/admin\/analytics$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "アクセス分析" }),
    ).toBeVisible();
  });
});
