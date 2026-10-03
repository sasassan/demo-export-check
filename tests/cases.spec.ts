import { expect, test } from "@playwright/test";

import { authenticate } from "./helpers/auth";

test.describe("案件の作成・一覧・詳細", () => {
  test("案件を作成して一覧・詳細に表示される", async ({ page }) => {
    const email = "e2e-case@example.com";
    const productName = "E2Eテスト用モーター";
    await authenticate(page, email);

    // AI調査実行のみモック（実APIを呼ばず、登録自体は実処理でインメモリDBに作成）
    await page.route("**/api/investigations/*/run", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, status: "completed" }),
      }),
    );

    await page.goto("/cases/new");
    await page.getByPlaceholder("例: 高精度サーボモーター").fill(productName);
    await page.getByPlaceholder("例: SRV-9800").fill("E2E-001");
    await page.getByPlaceholder("例: ベトナム").fill("シンガポール");
    await page
      .getByPlaceholder("例: Saigon Precision Parts Ltd.")
      .fill("E2E Test Trading Pte Ltd");
    await page
      .getByRole("button", { name: "案件を登録してAI確認を開始" })
      .click();

    // 詳細ページへ遷移し、商品名がタイトルに表示される
    await expect(page).toHaveURL(/\/cases\/case_/);
    await expect(
      page.getByRole("heading", { level: 1, name: productName }),
    ).toBeVisible();

    // 一覧ページに反映される
    await page.goto("/cases");
    await expect(
      page.getByRole("heading", { level: 1, name: "案件一覧" }),
    ).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

    // 一覧のカードから詳細へ遷移できる
    await page.getByText(productName).click();
    await expect(
      page.getByRole("heading", { level: 1, name: productName }),
    ).toBeVisible();
  });
});
