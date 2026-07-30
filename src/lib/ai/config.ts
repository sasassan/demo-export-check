import { createHash } from "node:crypto";

import type { AiModel } from "@/lib/types";

export type ProviderRuntimeStatus =
  | "live"
  | "fallback-no-key"
  | "fallback-disabled"
  | "fallback-error";

/**
 * 呼び出し用途。用途ごとに要求されるタイムアウト特性が異なるため区別する。
 * - health: 管理画面の疎通診断。極小プロンプトで応答が速いため短くてよい。遅いと管理画面が固まる
 * - analysis: リスク調査・ナラティブ生成。長文の構造化JSON出力を要求するため時間がかかる
 * - chat: AI相談室。ユーザーが待機するインタラクティブUIのため中間的な値
 */
export type AiCallPurpose = "health" | "analysis" | "chat";

export type ProviderRuntimeInfo = {
  model: AiModel;
  providerName: string;
  label: string;
  enabled: boolean;
  apiKey?: string;
  modelName: string;
  timeoutMs: number;
  status: ProviderRuntimeStatus;
  statusLabel: string;
  reason?: string;
  /** Organization/Projectスコープのキーを識別するための任意情報（法人アカウント移行用）。値そのものは常にマスクして扱うこと。 */
  orgId?: string;
  projectId?: string;
  baseUrl?: string;
};

type EnabledAiModel = "gpt-4o" | "claude" | "gemini";

type ProviderConfigDefinition = {
  model: AiModel;
  providerName: string;
  label: string;
  envKey: string;
  enabled: boolean;
  modelName: string;
  /** 用途別タイムアウトを解決する関数。共通timeoutMs(後方互換)はデフォルトとしてここに集約 */
  resolveTimeoutMs: (purpose: AiCallPurpose) => number;
  orgId?: string;
  projectId?: string;
  baseUrl?: string;
};

/**
 * 用途別タイムアウトを解決する。優先順位:
 * 1. 用途別env（例: OPENAI_ANALYSIS_TIMEOUT_MS）
 * 2. 共通env（例: OPENAI_TIMEOUT_MS）— 後方互換のための全用途一律上書き
 * 3. 用途別デフォルト値
 */
function resolveTimeoutForPurpose(
  providerPrefix: string,
  purpose: AiCallPurpose,
  defaults: { health: number; analysis: number; chat: number },
): number {
  const purposeEnvKey = `${providerPrefix}_${purpose.toUpperCase()}_TIMEOUT_MS`;
  const purposeValue = readOptionalEnv(purposeEnvKey);
  if (purposeValue) return Number(purposeValue);

  const commonValue = readOptionalEnv(`${providerPrefix}_TIMEOUT_MS`);
  if (commonValue) return Number(commonValue);

  return defaults[purpose];
}

/**
 * 環境変数の値を取得する。空文字は「未設定」として扱う（誤って空文字を
 * SDK/ヘッダーに渡し、個人アカウントの現状動作を壊さないようにするため）。
 */
function readOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

/**
 * Organization ID / Project ID などのスコープ識別子をマスクして返す。
 * APIキーそのものではないが、念のため先頭数文字以外は伏せる。
 * 例: "org-1234567890" -> "org-****7890"
 */
export function maskScopeId(value?: string): string | null {
  if (!value) return null;
  if (value.length <= 8) return `${value.slice(0, 2)}****`;
  const prefixMatch = value.match(/^[a-zA-Z]+[-_]/);
  const prefix = prefixMatch ? prefixMatch[0] : value.slice(0, 4);
  const suffix = value.slice(-4);
  return `${prefix}****${suffix}`;
}

/**
 * APIキーの実行時フィンガープリントを算出する（診断用）。
 * sha256ハッシュの先頭12文字のみを返し、キー本体は絶対に露出しない。
 * 「差し替え後に意図したキーが実際にロードされているか」を確認するための
 * 恒久的な診断機能。値は不可逆なハッシュのため復元不可能。
 * キー未設定の場合はnullを返す。
 */
export function getApiKeyFingerprint(apiKey?: string): string | null {
  if (!apiKey) return null;
  return createHash("sha256").update(apiKey).digest("hex").slice(0, 12);
}

const DEFAULT_PROVIDER_ORDER: EnabledAiModel[] = ["gpt-4o", "claude", "gemini"];

function parseEnabledProviders(value?: string): EnabledAiModel[] {
  if (!value) return DEFAULT_PROVIDER_ORDER;

  const parsed = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .map((item) => {
      if (item === "openai" || item === "gpt" || item === "gpt-4o") return "gpt-4o";
      if (item === "claude" || item === "anthropic") return "claude";
      if (item === "gemini" || item === "google") return "gemini";
      return null;
    })
    .filter((item): item is EnabledAiModel => item !== null);

  return parsed.length > 0 ? parsed : DEFAULT_PROVIDER_ORDER;
}

const enabledProviderSet = new Set(
  parseEnabledProviders(process.env.ENABLED_AI_PROVIDERS),
);

/**
 * 用途別タイムアウトのデフォルト値（ミリ秒）。
 * - health: 管理画面の診断表示が固まらないよう短く保つ
 * - analysis: gpt-4o等が長文の構造化JSONを返すのに要する時間を考慮し大幅に延長。
 *   実測値: gpt-4o-miniでの1件調査（3プロバイダー並列呼び出しのうちOpenAI単体)で
 *   約37.9秒、実キーでのgpt-4o実行E2E（/api/investigations/[id]/run全体）でも
 *   約37.2秒かかった実績があり、旧デフォルト45秒では余裕が約8秒(17%)しかなく
 *   実運用でタイムアウトが発生するリスクが高いと判断し50秒に引き上げた。
 *   50秒設定後の実測では余裕約13秒(26%)を確保できている。案件の内容や
 *   OpenAI側の混雑状況によって応答時間は変動しうるため、タイムアウトが
 *   頻発するようなら追加の引き上げ、またはリトライ戦略の見直しを検討すること。
 *   ただし調査APIルート(src/app/api/investigations/[id]/run/route.ts)の
 *   maxDuration=60秒、および調査エンドツーエンド総予算(INVESTIGATION_TOTAL_TIMEOUT_MS,
 *   デフォルト55秒)との整合性が必要なため、analysisタイムアウトは
 *   INVESTIGATION_TOTAL_TIMEOUT_MSより短い50秒に設定している。これより長くする
 *   場合は両方の値も合わせて引き上げること
 * - chat: インタラクティブなAI相談室向けの中間値
 * 実測に基づく暫定値のため、必要に応じて用途別envで上書きすること。
 */
const TIMEOUT_DEFAULTS = {
  health: 8000,
  analysis: 50000,
  chat: 30000,
} as const;

const providerDefinitions: ProviderConfigDefinition[] = [
  {
    model: "gpt-4o",
    providerName: "openai-gpt4o",
    label: "GPT-4o",
    envKey: "OPENAI_API_KEY",
    enabled: enabledProviderSet.has("gpt-4o"),
    modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
    resolveTimeoutMs: (purpose) =>
      resolveTimeoutForPurpose("OPENAI", purpose, TIMEOUT_DEFAULTS),
    orgId: readOptionalEnv("OPENAI_ORG_ID"),
    projectId: readOptionalEnv("OPENAI_PROJECT_ID"),
    baseUrl: readOptionalEnv("OPENAI_BASE_URL"),
  },
  {
    model: "claude",
    providerName: "anthropic-claude",
    label: "Claude",
    envKey: "ANTHROPIC_API_KEY",
    enabled: enabledProviderSet.has("claude"),
    modelName: process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307",
    resolveTimeoutMs: (purpose) =>
      resolveTimeoutForPurpose("ANTHROPIC", purpose, TIMEOUT_DEFAULTS),
    // Anthropicはキー発行時にWorkspace単位でスコープが確定するため、
    // 追加のOrganization/Project識別ヘッダーは不要（docs/account-migration.md参照）。
    baseUrl: readOptionalEnv("ANTHROPIC_BASE_URL"),
  },
  {
    model: "gemini",
    providerName: "google-gemini",
    label: "Gemini",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    enabled: enabledProviderSet.has("gemini"),
    modelName: process.env.GOOGLE_MODEL || "gemini-1.5-flash",
    resolveTimeoutMs: (purpose) =>
      resolveTimeoutForPurpose("GOOGLE", purpose, TIMEOUT_DEFAULTS),
    // AI StudioキーはGCPプロジェクトに暗黙的に紐づく。Vertex AI移行時は
    // GOOGLE_VERTEX_PROJECT_ID/GOOGLE_VERTEX_LOCATION等の別経路になる想定（未実装・予約のみ）。
    projectId: readOptionalEnv("GOOGLE_CLOUD_PROJECT_ID"),
  },
];

export function getProviderRuntimeInfo(
  model: AiModel,
  purpose: AiCallPurpose = "analysis",
): ProviderRuntimeInfo {
  const definition = providerDefinitions.find((item) => item.model === model);
  if (!definition) {
    return {
      model,
      providerName: model,
      label: model,
      enabled: false,
      modelName: model,
      timeoutMs: TIMEOUT_DEFAULTS[purpose],
      status: "fallback-disabled",
      statusLabel: "無効",
      reason: "設定未定義",
    };
  }

  const apiKey = process.env[definition.envKey];
  const timeoutMs = definition.resolveTimeoutMs(purpose);
  const definitionRest = {
    model: definition.model,
    providerName: definition.providerName,
    label: definition.label,
    enabled: definition.enabled,
    modelName: definition.modelName,
    orgId: definition.orgId,
    projectId: definition.projectId,
    baseUrl: definition.baseUrl,
  };

  if (!definition.enabled) {
    return {
      ...definitionRest,
      apiKey,
      timeoutMs,
      status: "fallback-disabled",
      statusLabel: "無効",
      reason: "ENABLED_AI_PROVIDERSで無効化",
    };
  }

  if (!apiKey) {
    return {
      ...definitionRest,
      apiKey,
      timeoutMs,
      status: "fallback-no-key",
      statusLabel: "APIキー未設定",
      reason: `${definition.envKey} が未設定`,
    };
  }

  return {
    ...definitionRest,
    apiKey,
    timeoutMs,
    status: "live",
    statusLabel: "実API",
  };
}

export function getEnabledAiModels(): AiModel[] {
  return providerDefinitions
    .filter((item) => item.enabled)
    .map((item) => item.model);
}

export function getAllProviderRuntimeInfo(
  purpose: AiCallPurpose = "analysis",
): ProviderRuntimeInfo[] {
  return providerDefinitions.map((item) =>
    getProviderRuntimeInfo(item.model, purpose),
  );
}
