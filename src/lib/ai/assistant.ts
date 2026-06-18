import OpenAI from "openai";

import { getProviderRuntimeInfo } from "@/lib/ai/config";
import type { AssistantAnswer } from "@/lib/ai/types";

export async function generateAssistantAnswer(input: {
  message: string;
  mode: string;
  sourceText?: string;
  sourceUrl?: string;
}) {
  const runtime = getProviderRuntimeInfo("gpt-4o");
  if (runtime.status !== "live" || !runtime.apiKey) {
    return null;
  }

  const client = new OpenAI({
    apiKey: runtime.apiKey,
    timeout: runtime.timeoutMs,
  });

  const modeLabelMap: Record<string, string> = {
    general: "通常相談",
    "beginner-explain": "初心者向けに説明",
    "relevance-check": "自社輸出への関係を判断",
    "document-read": "資料読解補助",
    dictionary: "辞典検索",
  };

  const prompt = `あなたは日本語で回答する輸出コンプライアンス支援AIです。
営業担当や輸出初心者にもわかる言葉で説明してください。
以下のJSON形式のみで返答してください。余分な文章は禁止です。

## 相談モード
${modeLabelMap[input.mode] ?? input.mode}

## 質問
${input.message || "（質問文なし）"}

## 参考URL
${input.sourceUrl || "なし"}

## 資料本文
${(input.sourceText || "なし").slice(0, 5000)}

## 出力JSON
{
  "title": "回答タイトル",
  "simpleExplanation": "初心者向けにわかりやすく説明した本文",
  "practicalUse": "実務でどう使うか",
  "caution": "注意点",
  "relatedRisk": "関係する輸出リスク",
  "extractedPoints": ["要点1", "要点2", "要点3"],
  "judgement": "自社輸出への関係性や判断",
  "recommendedChecks": ["次に確認すべき点1", "次に確認すべき点2", "次に確認すべき点3"],
  "caseDraft": {
    "productName": "案件化に使えそうな商品名",
    "modelNumber": "型番があれば",
    "destinationCountry": "輸出先国が分かれば",
    "customerCompanyName": "相手企業名が分かれば"
  }
}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは輸出実務とコンプライアンスの支援AIです。初心者にも分かる日本語で、必ずJSONのみ返してください。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as Omit<AssistantAnswer, "relatedFeatures" | "referenceLinks">;

    return {
      ...parsed,
      relatedFeatures: [
        { label: "輸出辞典を見る", href: "/glossary" },
        { label: "学習コンテンツを見る", href: "/learning" },
        { label: "デモ画面を見る", href: "/demo" },
      ],
      referenceLinks: input.sourceUrl
        ? [{ label: "入力した参考URL", href: input.sourceUrl }]
        : [],
    } satisfies AssistantAnswer;
  } catch {
    return null;
  }
}
