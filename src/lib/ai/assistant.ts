import type OpenAI from "openai";
import type Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getProviderRuntimeInfo, type ProviderRuntimeInfo } from "@/lib/ai/config";
import { callWithRetry, logAiError } from "@/lib/ai/error-handling";
import { createOpenAiClient, createAnthropicClient } from "@/lib/ai/client-factory";
import type { AiModel } from "@/lib/types";

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

/* ---------- Claude structured outputs schema ----------
 * @anthropic-ai/sdk の output_config.format(type: "json_schema") を使い、
 * OpenAIのresponse_format相当の構造化出力をClaudeにも強制する。
 * これにより「前後に説明文/マークダウンを付けない」という自然文指示だけに頼らず、
 * レスポンスのcontentブロックが常にJSON_SCHEMAと一致するテキストになることをAPI側で保証する。
 */
const CLAUDE_OUTPUT_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    documentSummary: { type: "string" },
    simpleExplanation: { type: "string" },
    practicalUse: { type: "string" },
    caution: { type: "string" },
    relatedRisk: { type: "string" },
    extractedPoints: { type: "array", items: { type: "string" } },
    relatedClauses: { type: "array", items: { type: "string" } },
    keywordHighlights: { type: "array", items: { type: "string" } },
    judgement: { type: "string" },
    recommendedChecks: { type: "array", items: { type: "string" } },
    caseDraft: {
      type: "object",
      properties: {
        productName: { type: ["string", "null"] },
        modelNumber: { type: ["string", "null"] },
        destinationCountry: { type: ["string", "null"] },
        customerCompanyName: { type: ["string", "null"] },
      },
      required: ["productName", "modelNumber", "destinationCountry", "customerCompanyName"],
      additionalProperties: false,
    },
    referenceLinks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          href: { type: "string" },
        },
        required: ["label", "href"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "title",
    "documentSummary",
    "simpleExplanation",
    "practicalUse",
    "caution",
    "relatedRisk",
    "extractedPoints",
    "relatedClauses",
    "keywordHighlights",
    "judgement",
    "recommendedChecks",
    "caseDraft",
    "referenceLinks",
  ],
  additionalProperties: false,
} as const;

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
  /** 優先して使うAIモデル。未指定時はGPT-4o→Gemini→Claudeの順でフォールバックする */
  aiModel?: AiModel;
};

/* ---------- result types ---------- */
export type AskAssistantResult =
  | { ok: true; data: Record<string, unknown>; usedModel: AiModel }
  | { ok: false; reason: "no-key" | "error"; errorMessage?: string };

type ChatMessage = { role: "user" | "assistant"; content: string };

type ProviderAttempt = {
  model: AiModel;
  label: string;
  status: "live" | "no-key" | "disabled";
  runtime: ProviderRuntimeInfo;
};

/* ---------- helpers ---------- */
function buildSystemPrompt(mode: string): string {
  const modePrompt = MODE_PROMPTS[mode] ?? MODE_PROMPTS.general;
  return `${modePrompt}\n\n${JSON_SCHEMA}`;
}

function buildContextBlock(input: AskAssistantInput): string {
  const contextParts: string[] = [];
  if (input.sourceText) {
    contextParts.push(`【貼り付けられた資料本文】\n${input.sourceText.slice(0, 6000)}`);
  }
  if (input.fetchedUrlText) {
    contextParts.push(`【URL自動取得本文】\n${input.fetchedUrlText.slice(0, 4000)}`);
  }
  if (input.sourceUrl) {
    if (input.sourceText || input.fetchedUrlText) {
      contextParts.push(`参考URL: ${input.sourceUrl}`);
    } else {
      // URL本文の自動取得に失敗した場合、AIが「資料を読んだ」と誤認しないよう明示する。
      contextParts.push(
        `【注意】指定URL(${input.sourceUrl})の本文自動取得に失敗したため、資料本文は提供されていません。URLの内容を読んだ前提の回答はせず、取得できなかった旨を利用者に伝えてください。`,
      );
    }
  }
  return contextParts.length > 0
    ? `\n\n--- 参考資料 ---\n${contextParts.join("\n\n")}\n--- 参考資料ここまで ---`
    : "";
}

function buildChatMessages(input: AskAssistantInput): ChatMessage[] {
  const messages: ChatMessage[] = [];
  if (input.history && input.history.length > 0) {
    const recentHistory = input.history.slice(-6);
    for (const entry of recentHistory) {
      messages.push({ role: entry.role, content: entry.content });
    }
  }
  const userContent = `${input.message}${buildContextBlock(input)}`;
  messages.push({ role: "user", content: userContent });
  return messages;
}

export function parseAssistantJson(raw: string): Record<string, unknown> | null {
  try {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/* ---------- provider implementations ---------- */
async function callOpenAiAssistant(
  runtime: ProviderRuntimeInfo,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ raw: string; usedModel: AiModel }> {
  const client = createOpenAiClient(runtime);
  const openAiMessages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const callOnce = () =>
    callWithRetry(
      () =>
        client.chat.completions.create({
          model: runtime.modelName,
          messages: openAiMessages,
          temperature: 0.3,
          max_tokens: 2500,
          response_format: { type: "json_object" },
        }),
      { providerLabel: "assistant-gpt4o" },
    );

  let completion = await callOnce();
  let raw = completion.choices[0]?.message?.content ?? "";
  if (!parseAssistantJson(raw)) {
    console.error("[AI:assistant-gpt4o] JSONパース失敗のため1回リトライします");
    completion = await callOnce();
    raw = completion.choices[0]?.message?.content ?? "";
  }
  return { raw, usedModel: "gpt-4o" };
}

async function callClaudeAssistant(
  runtime: ProviderRuntimeInfo,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ raw: string; usedModel: AiModel }> {
  const client = createAnthropicClient(runtime);
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const callOnce = () =>
    callWithRetry(
      () =>
        client.messages.create({
          model: runtime.modelName,
          max_tokens: 6000,
          system: `${systemPrompt}\n\n必ず上記JSONスキーマのみを返し、前後に説明文やマークダウンを含めないでください。`,
          messages: anthropicMessages,
          // Structured Outputs: content[0]がtext以外のブロック(thinking等)になり得る
          // claude-sonnet-5系モデルでも、API側でJSON_SCHEMA準拠のテキスト出力を強制する。
          // これにより素のテキスト指示だけに依存したJSONパース失敗を防ぐ。
          output_config: {
            format: {
              type: "json_schema",
              schema: CLAUDE_OUTPUT_JSON_SCHEMA,
            },
          },
        }),
      { providerLabel: "assistant-claude" },
    );

  // content[0]が常にtextブロックとは限らない(thinking等が先行する場合がある)ため、
  // 配列全体からtextブロックを探して結合する。
  const extractText = (blocks: Anthropic.ContentBlock[]): string =>
    blocks
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

  let response = await callOnce();
  let raw = extractText(response.content);
  if (!parseAssistantJson(raw)) {
    console.error("[AI:assistant-claude] JSONパース失敗のため1回リトライします");
    response = await callOnce();
    raw = extractText(response.content);
  }
  return { raw, usedModel: "claude" };
}

async function callGeminiAssistant(
  runtime: ProviderRuntimeInfo,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ raw: string; usedModel: AiModel }> {
  const genAI = new GoogleGenerativeAI(runtime.apiKey!);
  const model = genAI.getGenerativeModel(
    {
      model: runtime.modelName,
      generationConfig: { responseMimeType: "application/json" },
    },
    { timeout: runtime.timeoutMs },
  );

  const callOnce = () =>
    callWithRetry(
      () =>
        model.generateContent({
          systemInstruction: `${systemPrompt}\n\n必ず上記JSONスキーマのみを返し、前後に説明文やマークダウンを含めないでください。`,
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        }),
      { providerLabel: "assistant-gemini" },
    );

  let result = await callOnce();
  let raw = result.response.text();
  if (!parseAssistantJson(raw)) {
    console.error("[AI:assistant-gemini] JSONパース失敗のため1回リトライします");
    result = await callOnce();
    raw = result.response.text();
  }
  return { raw, usedModel: "gemini" };
}

/* ---------- provider selection ---------- */
export function buildProviderAttempts(preferredModel?: AiModel): ProviderAttempt[] {
  const preferred =
    preferredModel === "gpt-4o" || preferredModel === "gemini" || preferredModel === "claude"
      ? preferredModel
      : undefined;
  const models: AiModel[] = ["gpt-4o", "gemini", "claude"];
  const ordered = preferred ? [preferred, ...models.filter((m) => m !== preferred)] : models;

  return ordered.map((model) => {
    const runtime = getProviderRuntimeInfo(model, "chat");
    return {
      model,
      label:
        model === "gpt-4o"
          ? "assistant-gpt4o"
          : model === "gemini"
            ? "assistant-gemini"
            : "assistant-claude",
      status:
        runtime.status === "live" && runtime.apiKey
          ? "live"
          : runtime.status === "fallback-no-key"
            ? "no-key"
            : "disabled",
      runtime,
    };
  });
}

async function tryProvider(
  attempt: ProviderAttempt,
  systemPrompt: string,
  messages: ChatMessage[],
): Promise<{ ok: true; data: Record<string, unknown>; usedModel: AiModel } | { ok: false; reason: "no-key" | "error"; errorMessage?: string }> {
  if (attempt.status !== "live") {
    return { ok: false, reason: attempt.status === "no-key" ? "no-key" : "error", errorMessage: `${attempt.model} is not configured` };
  }

  try {
    const result =
      attempt.model === "claude"
        ? await callClaudeAssistant(attempt.runtime, systemPrompt, messages)
        : attempt.model === "gemini"
          ? await callGeminiAssistant(attempt.runtime, systemPrompt, messages)
          : await callOpenAiAssistant(attempt.runtime, systemPrompt, messages);
    const parsed = parseAssistantJson(result.raw);
    if (!parsed) {
      return { ok: false, reason: "error", errorMessage: `${attempt.model}: JSON parse failed after retry` };
    }
    return { ok: true, data: parsed, usedModel: result.usedModel };
  } catch (error) {
    const classified = logAiError(attempt.label, error);
    return { ok: false, reason: "error", errorMessage: classified.message };
  }
}

/* ---------- main function ---------- */
export async function askAssistant(input: AskAssistantInput): Promise<AskAssistantResult> {
  const systemPrompt = buildSystemPrompt(input.mode);
  const messages = buildChatMessages(input);
  const attempts = buildProviderAttempts(input.aiModel);

  const errors: string[] = [];

  for (const attempt of attempts) {
    const result = await tryProvider(attempt, systemPrompt, messages);
    if (result.ok) {
      return result;
    }
    if (result.reason === "no-key") {
      // キー未設定は次のプロバイダーへ
      continue;
    }
    errors.push(result.errorMessage ?? `${attempt.model} failed`);
    // エラー時もフォールバックを試す
  }

  if (errors.length === 0) {
    return { ok: false, reason: "no-key" };
  }
  return { ok: false, reason: "error", errorMessage: errors.join("; ") };
}
