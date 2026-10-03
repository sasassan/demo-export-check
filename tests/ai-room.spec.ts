import { expect, test } from "@playwright/test";

test.describe("AI相談室", () => {
  test("質問を送信してAI回答が表示される", async ({ page }) => {
    const answerText = "これはE2Eテストのモック回答です。";
    await page.route("**/api/assistant", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          answer: {
            answerSource: "fallback-no-key",
            answerSourceLabel: "テスト用モック応答",
            title: "E2Eテスト",
            simpleExplanation: answerText,
            practicalUse: "テスト用",
            caution: "テスト用",
            relatedRisk: "テスト用",
            relatedFeatures: [],
            followUpQuestions: [],
          },
          usedModel: "gpt-4o",
          consultationId: "consult-e2e-test",
        }),
      }),
    );

    await page.goto("/ai-room");
    const textarea = page.getByPlaceholder(
      "輸出について不安なこと、資料の意味、規制の見方などを入力してください",
    );
    await textarea.fill("ベトナム向け輸出の注意点を教えてください");
    await page.getByRole("button", { name: "AIに質問する" }).click();

    await expect(page.getByText(answerText)).toBeVisible();
  });
});
