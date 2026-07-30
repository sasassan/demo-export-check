/**
 * OpenAI / Anthropic SDKクライアントの生成を一元化するファクトリ。
 *
 * 法人（Organization / Project）アカウント移行時、APIキーがOrganization/Project単位で
 * 発行されるケースに備え、`ProviderRuntimeInfo` の orgId/projectId/baseUrl が
 * 設定されている場合のみSDKへ渡す。未設定なら一切のオプションを渡さず、
 * 個人アカウントの現状動作（SDKデフォルト）を変えない。
 *
 * 参考: OpenAI Node SDK は organization/project に空文字や未定義を渡すと
 * `OpenAI-Organization` / `OpenAI-Project` ヘッダー自体を送らない仕様のため、
 * ここでも「値がある場合のみキーを含める」方針を徹底する。
 */
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import type { ProviderRuntimeInfo } from "@/lib/ai/config";

export function createOpenAiClient(runtime: Pick<ProviderRuntimeInfo, "apiKey" | "timeoutMs" | "orgId" | "projectId" | "baseUrl">): OpenAI {
  const options: ConstructorParameters<typeof OpenAI>[0] = {
    apiKey: runtime.apiKey,
    timeout: runtime.timeoutMs,
  };
  if (runtime.orgId) options.organization = runtime.orgId;
  if (runtime.projectId) options.project = runtime.projectId;
  if (runtime.baseUrl) options.baseURL = runtime.baseUrl;
  return new OpenAI(options);
}

export function createAnthropicClient(runtime: Pick<ProviderRuntimeInfo, "apiKey" | "timeoutMs" | "baseUrl">): Anthropic {
  const options: ConstructorParameters<typeof Anthropic>[0] = {
    apiKey: runtime.apiKey,
    timeout: runtime.timeoutMs,
  };
  if (runtime.baseUrl) options.baseURL = runtime.baseUrl;
  return new Anthropic(options);
}
