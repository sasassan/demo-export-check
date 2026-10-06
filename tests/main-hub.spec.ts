import { expect, test } from "@playwright/test";

import { authenticate, TEST_USER_EMAIL } from "./helpers/auth";

test.describe("メインページ（ハブ）", () => {
  test("未ログイン時は主要機能カード・今日のやること・ログイン導線が表示される", async ({ page }) => {
    await page.goto("/main");
    await expect(page).toHaveURL(/\/main/);
    await expect(page.getByRole("heading", { level: 1, name: "メインページ" })).toBeVisible();

    for (const cardName of ["ダッシュボード", "AI相談室", "輸出用語辞典", "学習コンテンツ"]) {
      await expect(page.getByRole("link", { name: new RegExp(cardName) }).first()).toBeVisible();
    }

    await expect(page.getByRole("heading", { name: "今日のやること" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "最近の案件" })).toBeVisible();
    await expect(page.getByRole("link", { name: "ログイン", exact: true }).first()).toBeVisible();
  });

  test("ログイン済みではユーザー情報と新規案件導線が表示される", async ({ page }) => {
    await authenticate(page, TEST_USER_EMAIL);
    await page.goto("/main");
    await expect(page).toHaveURL(/\/main/);
    await expect(page.getByRole("heading", { name: "今日のやること" })).toBeVisible();
    await expect(page.getByRole("link", { name: "新規案件を登録" }).first()).toBeVisible();
    await expect(page.getByText(TEST_USER_EMAIL)).toBeVisible();
  });

  test("ヘッダーの「メイン」リンクからハブページへ遷移できる", async ({ page }) => {
    await page.goto("/demo");
    await page.getByRole("link", { name: "メイン", exact: true }).click();
    await expect(page).toHaveURL(/\/main/);
    await expect(page.getByRole("heading", { level: 1, name: "メインページ" })).toBeVisible();
  });

  test("フッターの「トップページに戻る」でトップへ戻れる", async ({ page }) => {
    await page.goto("/main");
    await page.getByRole("link", { name: "トップページに戻る" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("その輸出");
  });
});
