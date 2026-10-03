import { expect, test } from "@playwright/test";

import { ADMIN_EMAIL, authenticate } from "./helpers/auth";

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
    await expect(page).toHaveURL(/\/login$/);
  });
});
