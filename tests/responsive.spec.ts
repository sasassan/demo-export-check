import { expect, test } from "@playwright/test";

test.describe("レスポンシブ表示", () => {
  test("トップページがデスクトップ/モバイルで表示される", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("その輸出");
  });

  test("ヘッダーがデスクトップ/モバイルで切り替わる", async ({ page, isMobile }) => {
    await page.goto("/about");

    const openMenu = page.getByRole("button", { name: "メニューを開く" });
    const closeMenu = page.getByRole("button", { name: "メニューを閉じる" });
    const mobileMenu = page.locator("#mobile-nav-menu");

    if (isMobile) {
      // モバイル: ハンバーガーが表示され、メニューは初期状態では閉じている
      await expect(openMenu).toBeVisible();
      await expect(mobileMenu).toHaveCount(0);

      await openMenu.click();
      await expect(closeMenu).toBeVisible();
      await expect(mobileMenu).toBeVisible();
      await expect(
        mobileMenu.getByRole("link", { name: "デモ" }),
      ).toBeVisible();
    } else {
      // デスクトップ: ハンバーガーは非表示で、デスクトップナビが表示される
      await expect(openMenu).toBeHidden();
      await expect(mobileMenu).toHaveCount(0);
      await expect(
        page.locator("header").getByRole("link", { name: "デモ" }),
      ).toBeVisible();
    }
  });
});
