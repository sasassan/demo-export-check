import OpenAI from "openai";

import { getProviderRuntimeInfo } from "@/lib/ai/config";

/* ---------- mode-specific system prompts ---------- */
const BASE_ROLE =
  "あなたは輸出管理・貿易コンプライアンスの実務支援AIです。法的助言ではなく、一般的な読解支援・情報整理を行います。";

const MODE_PROMPTS: Record<string, string> = {
  general: `${BASE_ROLE}
利用者は輸出管理に不慣れな営業担当者です。
専門用語を使う場合は括弧書きで補足してください。
質問の意図をくみ取り、「次に何を確認すべきか」を具体的に提示してください。`,

  "beginner-explain": `${BASE_ROLE}
利用者は輸出管理の専門知識がほとんどない初心者です。
資料や条文を「小学5年生でも分かるレベル」に言い換えてください。
箇条書きで要点を整理し、具体例を交えてください。
条文番号がある場合は「この条文は○○を意味します」と明示してください。`,

  "relevance-check": `${BASE_ROLE}
利用者の目的は「この資料・条文が自社の輸出に関係するか」を判断することです。
回答では以下の3点を必ず含めてください:
1. 関係性の有無（「関係あり」「関係なし」「要確認」）
2. 関係する場合、具体的にどの部分が該当するか
3. 次に確認すべきアクション`,

  "document-read": `${BASE_ROLE}
利用者は長文の法令・通達・社内規程・ガイドラインを読解する補助を求めています。
以下の構造で回答してください:
1. 資料全体の要約（2〜3文）
2. 条文・規程のキーポイント（箇条書き）
3. 実務上の影響（「現場では○○を確認する必要がある」）
4. 重要な専門用語の解説
5. 次に確認すべき点`,

  dictionary: `${BASE_ROLE}
利用者は輸出・貿易の専門用語を調べています。
以下の構造で回答してください:
1. 用語の簡単な説明（1〜2文、初心者向け）
2. 実務で使う場面（具体的なシチュエーション）
3. 注意点（よくある誤解、間違いやすい点）
4. 関連する輸出リスク
5. 関連する用語（あれば）`,
};

/* ---------- JSON output schema ---------- */
const JSON_SCHEMA = `## 出力JSON
{
  "title": "回答タイトル",
  "documentSummary": "資料全体の要点を2〜3文で要約",
  "simpleExplanation": "初心者向けにわかりやすく説明した本文",
  "practicalUse": "実務でどう使うか",
  "caution": "注意点",
  "relatedRisk": "関係する輸出リスク",
  "extractedPoints": ["要点1", "要点2", "要点3"],
  "relatedClauses": ["関連条文や規程の要旨1", "関連条文や規程の要旨2"],
  "keywordHighlights": ["重要語句1", "重要語句2", "重要語句3"],
  "judgement": "自社輸出への関係性や判断",
  "recommendedChecks": ["次に確認すべき点1", "次に確認すべき点2", "次に確認すべき点3"],
  "caseDraft": {
    "productName": "案件化に使えそうな商品名",
    "modelNumber": "型番があれば",
    "destinationCountry": "国名があれば",
    "customerCompanyName": "企業名があれば"
  },
  "referenceLinks": [
    { "label": "参考リンク名", "href": "URL" }
  ]
}
必ず有効なJSONだけを返してください。`;

/* ---------- types ---------- */
export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AskAssistantInput = {
  message: string;
  mode: string;
  sourceText?: string;
  sourceUrl?: string;
  fetchedUrlText?: string;
  history?: ConversationMessage[];
};

/* ---------- main function ---------- */
export async function askAssistant(input: AskAssistantInput) {
  const openaiInfo = getProviderRuntimeInfo("gpt-4o");
  const apiKey = openaiInfo.apiKey;

  if (!apiKey) {
    return null; // caller handles fallback
  }

  const systemPrompt = MODE_PROMPTS[input.mode] ?? MODE_PROMPTS.general;

  // Build context from source materials
  const contextParts: string[] = [];
  if (input.sourceText) {
    contextParts.push(`【貼り付けられた資料本文】\n${input.sourceText.slice(0, 6000)}`);
  }
  if (input.fetchedUrlText) {
    contextParts.push(`【URL自動取得本文】\n${input.fetchedUrlText.slice(0, 4000)}`);
  }
  if (input.sourceUrl) {
    contextParts.push(`参考URL: ${input.sourceUrl}`);
  }
  const contextBlock = contextParts.length > 0
    ? `\n\n--- 参考資料 ---\n${contextParts.join("\n\n")}\n--- 参考資料ここまで ---`
    : "";

  // Build message history
  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `${systemPrompt}\n\n${JSON_SCHEMA}`,
    },
  ];

  // Include conversation history (last 6 turns max for context window)
  if (input.history && input.history.length > 0) {
    const recentHistory = input.history.slice(-6);
    for (const entry of recentHistory) {
      messages.push({
        role: entry.role,
        content: entry.content,
      });
    }
  }

  // Current user message
  const userContent = `${input.message}${contextBlock}`;
  messages.push({ role: "user", content: userContent });

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error("[askAssistant] AI call failed:", error);
    return null;
  }
}
