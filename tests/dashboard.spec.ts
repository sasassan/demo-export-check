import { expect, test } from "@playwright/test";

import { authenticate } from "./helpers/auth";

test.describe("ダッシュボード", () => {
  test("認証済みユーザーでダッシュボードが表示される", async ({ page }) => {
    const email = "e2e-dashboard@example.com";
    await authenticate(page, email);

    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { level: 1, name: "案件一覧" }),
    ).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();

    // このユーザーには案件が無いため空状態が表示される
    await expect(page.getByText("案件がまだありません")).toBeVisible();
    await expect(page.getByRole("link", { name: "新規案件を登録" })).toBeVisible();
  });
});
