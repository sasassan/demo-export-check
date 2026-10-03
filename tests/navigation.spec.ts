import { expect, test } from "@playwright/test";

test.describe("公開ページのナビゲーション", () => {
  test("トップページ → About → ログインページに遷移できる", async ({ page }) => {
    // トップページ
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    const topHeading = page.getByRole("heading", { level: 1 });
    await expect(topHeading).toBeVisible();
    await expect(topHeading).toContainText("その輸出");

    // About（概要）へ遷移
    await page.getByRole("link", { name: "概要", exact: true }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Export Risk Navi とは？" }),
    ).toBeVisible();

    // ログインページへ遷移（サイト上にログイン導線リンクは無いため直接遷移）
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("button", { name: "確認コードを送信" }),
    ).toBeVisible();
  });

  test("存在しないURLでは404ページが表示される", async ({ page }) => {
    await page.goto("/does-not-exist-e2e");
    await expect(
      page.getByRole("heading", { level: 1, name: "ページが見つかりません" }),
    ).toBeVisible();
  });
});
