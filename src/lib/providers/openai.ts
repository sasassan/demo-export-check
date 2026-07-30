import { getProviderRuntimeInfo } from "@/lib/ai/config";
import { callWithRetry, logAiError } from "@/lib/ai/error-handling";
import { createOpenAiClient } from "@/lib/ai/client-factory";

export type NarrativeInput = {
  productName: string;
  destinationCountry: string;
  customerCompanyName: string;
  overallGrade: "A" | "B" | "C";
  highlights: string[];
};

/**
 * テンプレートベースのフォールバックナレーション。
 * APIキー未設定時・API呼び出し失敗時に使用する。
 * orchestrator側でnarrative呼び出しが残り予算内に完了しなかった場合にも
 * この関数を再利用してフォールバックする。
 */
export function buildフォールバックNarrative(input: NarrativeInput): string {
  const headline =
    input.overallGrade === "C"
      ? "高リスク案件として社内承認前提で確認が必要です。"
      : input.overallGrade === "B"
        ? "追加確認を前提に進められる可能性があります。"
        : "現時点では大きな懸念は限定的です。";

  return [
    `${input.productName} を ${input.customerCompanyName} 向けに ${input.destinationCountry} へ輸出する案件について、初期調査を実施しました。`,
    headline,
    `主な確認事項は ${input.highlights.join("、")} です。`,
    "法令判断は最終的に社内確認を前提としつつ、営業担当でも論点を把握しやすいように整理しています。",
  ].join("");
}

/**
 * レポートナレーション（案件詳細・レポートプレビュー・PDFで表示される補足説明）を生成する。
 * OpenAI APIキーが設定されていれば実APIで生成し、未設定・呼び出し失敗時は
 * buildフォールバックNarrative によるテンプレート生成に安全にフォールバックする。
 */
export async function generateNarrative(input: NarrativeInput): Promise<string> {
  const runtime = getProviderRuntimeInfo("gpt-4o", "analysis");
  const apiKey = runtime.apiKey;

  if (runtime.status !== "live" || !apiKey) {
    return buildフォールバックNarrative(input);
  }

  try {
    const client = createOpenAiClient(runtime);
    const response = await callWithRetry(
      () =>
        client.chat.completions.create({
          model: runtime.modelName,
          messages: [
            {
              role: "system",
              content:
                "あなたは輸出コンプライアンスレポートのナレーション作成者です。営業担当者にも分かりやすい日本語で、3〜5文程度の簡潔な補足説明を作成してください。専門用語は避け、法的助言ではなく社内確認を促す文体にしてください。",
            },
            {
              role: "user",
              content: [
                `商品名: ${input.productName}`,
                `輸出先国: ${input.destinationCountry}`,
                `取引先企業名: ${input.customerCompanyName}`,
                `総合リスクグレード: ${input.overallGrade}`,
                `注目すべき確認事項: ${input.highlights.join("、") || "特になし"}`,
                "上記の案件について、調査結果の補足説明・要約を作成してください。",
              ].join("\n"),
            },
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      { providerLabel: "narrative-gpt4o" },
    );

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("generateNarrative: empty response");
    return text;
  } catch (error) {
    logAiError("narrative-gpt4o", error);
    return buildフォールバックNarrative(input);
  }
}
