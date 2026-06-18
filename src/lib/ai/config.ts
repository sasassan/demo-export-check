import type { AiModel } from "@/lib/types";

export type ProviderRuntimeStatus =
  | "live"
  | "fallback-no-key"
  | "fallback-disabled"
  | "fallback-error";

export type ProviderRuntimeInfo = {
  model: AiModel;
  providerName: string;
  label: string;
  enabled: boolean;
  apiKey?: string;
  timeoutMs: number;
  status: ProviderRuntimeStatus;
  statusLabel: string;
  reason?: string;
};

type EnabledAiModel = "gpt-4o" | "claude" | "gemini";

type ProviderConfigDefinition = {
  model: AiModel;
  providerName: string;
  label: string;
  envKey: string;
  enabled: boolean;
  timeoutMs: number;
};

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

const providerDefinitions: ProviderConfigDefinition[] = [
  {
    model: "gpt-4o",
    providerName: "openai-gpt4o",
    label: "GPT-4o",
    envKey: "OPENAI_API_KEY",
    enabled: enabledProviderSet.has("gpt-4o"),
    timeoutMs: Number(process.env.OPENAI_TIMEOUT_MS ?? "8000"),
  },
  {
    model: "claude",
    providerName: "anthropic-claude",
    label: "Claude",
    envKey: "ANTHROPIC_API_KEY",
    enabled: enabledProviderSet.has("claude"),
    timeoutMs: Number(process.env.ANTHROPIC_TIMEOUT_MS ?? "8000"),
  },
  {
    model: "gemini",
    providerName: "google-gemini",
    label: "Gemini",
    envKey: "GOOGLE_GENERATIVE_AI_API_KEY",
    enabled: enabledProviderSet.has("gemini"),
    timeoutMs: Number(process.env.GOOGLE_TIMEOUT_MS ?? "8000"),
  },
];

export function getProviderRuntimeInfo(model: AiModel): ProviderRuntimeInfo {
  const definition = providerDefinitions.find((item) => item.model === model);
  if (!definition) {
    return {
      model,
      providerName: model,
      label: model,
      enabled: false,
      timeoutMs: 8000,
      status: "fallback-disabled",
      statusLabel: "無効",
      reason: "設定未定義",
    };
  }

  const apiKey = process.env[definition.envKey];

  if (!definition.enabled) {
    return {
      ...definition,
      apiKey,
      status: "fallback-disabled",
      statusLabel: "無効",
      reason: "ENABLED_AI_PROVIDERSで無効化",
    };
  }

  if (!apiKey) {
    return {
      ...definition,
      apiKey,
      status: "fallback-no-key",
      statusLabel: "APIキー未設定",
      reason: `${definition.envKey} が未設定`,
    };
  }

  return {
    ...definition,
    apiKey,
    status: "live",
    statusLabel: "実API",
  };
}

export function getEnabledAiModels(): AiModel[] {
  return providerDefinitions
    .filter((item) => item.enabled)
    .map((item) => item.model);
}

export function getAllProviderRuntimeInfo(): ProviderRuntimeInfo[] {
  return providerDefinitions.map((item) => getProviderRuntimeInfo(item.model));
}
