import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getAllProviderRuntimeInfo, getApiKeyFingerprint, maskScopeId } from "@/lib/ai/config";
import { classifyAiError, logAiError } from "@/lib/ai/error-handling";
import { createOpenAiClient, createAnthropicClient } from "@/lib/ai/client-factory";
import type { ProviderRuntimeInfo } from "@/lib/ai/config";

export const dynamic = "force-dynamic";

type ProviderHealth = {
  provider: "gpt-4o" | "claude" | "gemini";
  configured: boolean;
  model: string;
  reachable: boolean;
  latencyMs: number | null;
  error?: string;
  /**
   * true の場合、疎通失敗の原因がモデル自体の廃止(404 NOT_FOUND)であることを示す。
   * 認証エラー(401)・レート制限(429)・タイムアウト等の一時的/設定起因の疎通失敗と
   * 区別するためのフラグ。2026-07-30に gemini-1.5-flash → gemini-2.0-flash と
   * 2回連続でモデル廃止事故を踏んだため、health診断で明示的に検知できるようにした。
   */
  modelDeprecated: boolean;
  /** Organization/Projectスコープのキーを識別するための情報。値は常にマスク済み。未設定はnull。 */
  orgId: string | null;
  projectId: string | null;
  /**
   * 実行時にロードされているAPIキーのsha256フィンガープリント(先頭12文字)。
   * キー差し替え後に「意図したキーが実際に読まれているか」を確認するための診断用。
   * キー未設定ならnull。値そのものからは復元不可能。
   */
  keyFingerprint: string | null;
};

type PingResult = { reachable: boolean; latencyMs: number; error?: string; modelDeprecated: boolean };

/** 各プロバイダーに極小のping的プロンプトを送り、疎通確認する。APIキーの値は返さない。 */
async function pingOpenAi(runtime: ProviderRuntimeInfo): Promise<PingResult> {
  const start = Date.now();
  try {
    const client = createOpenAiClient(runtime);
    await client.chat.completions.create({
      model: runtime.modelName,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    });
    return { reachable: true, latencyMs: Date.now() - start, modelDeprecated: false };
  } catch (error) {
    const classified = logAiError("health-openai", error);
    return {
      reachable: false,
      latencyMs: Date.now() - start,
      error: `${classified.kind} (status: ${classified.status ?? "n/a"})`,
      modelDeprecated: classified.kind === "not_found",
    };
  }
}

async function pingClaude(runtime: ProviderRuntimeInfo): Promise<PingResult> {
  const start = Date.now();
  try {
    const client = createAnthropicClient(runtime);
    await client.messages.create({
      model: runtime.modelName,
      max_tokens: 1,
      messages: [{ role: "user", content: "ping" }],
    });
    return { reachable: true, latencyMs: Date.now() - start, modelDeprecated: false };
  } catch (error) {
    const classified = logAiError("health-claude", error);
    return {
      reachable: false,
      latencyMs: Date.now() - start,
      error: `${classified.kind} (status: ${classified.status ?? "n/a"})`,
      modelDeprecated: classified.kind === "not_found",
    };
  }
}

async function pingGemini(apiKey: string, model: string, timeoutMs: number): Promise<PingResult> {
  const start = Date.now();
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model }, { timeout: timeoutMs });
    await genModel.generateContent("ping");
    return { reachable: true, latencyMs: Date.now() - start, modelDeprecated: false };
  } catch (error) {
    const classified = logAiError("health-gemini", error);
    return {
      reachable: false,
      latencyMs: Date.now() - start,
      error: `${classified.kind} (status: ${classified.status ?? "n/a"})`,
      modelDeprecated: classified.kind === "not_found",
    };
  }
}

export async function GET() {
  const email = await getSessionEmail();
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const runtimeInfos = getAllProviderRuntimeInfo("health");

  const results: ProviderHealth[] = await Promise.all(
    runtimeInfos.map(async (info): Promise<ProviderHealth> => {
      const configured = info.status === "live" && Boolean(info.apiKey);
      const orgId = maskScopeId(info.orgId);
      const projectId = maskScopeId(info.projectId);
      const keyFingerprint = getApiKeyFingerprint(info.apiKey);

      if (!configured || !info.apiKey) {
        return {
          provider: info.model as "gpt-4o" | "claude" | "gemini",
          configured: false,
          model: info.modelName,
          reachable: false,
          latencyMs: null,
          modelDeprecated: false,
          orgId,
          projectId,
          keyFingerprint,
        };
      }

      let pingResult: PingResult;
      try {
        if (info.model === "gpt-4o") {
          pingResult = await pingOpenAi(info);
        } else if (info.model === "claude") {
          pingResult = await pingClaude(info);
        } else if (info.model === "gemini") {
          pingResult = await pingGemini(info.apiKey, info.modelName, info.timeoutMs);
        } else {
          pingResult = { reachable: false, latencyMs: 0, error: "unsupported provider", modelDeprecated: false };
        }
      } catch (error) {
        const classified = classifyAiError(error);
        pingResult = {
          reachable: false,
          latencyMs: 0,
          error: `${classified.kind} (status: ${classified.status ?? "n/a"})`,
          modelDeprecated: classified.kind === "not_found",
        };
      }

      return {
        provider: info.model as "gpt-4o" | "claude" | "gemini",
        configured: true,
        model: info.modelName,
        reachable: pingResult.reachable,
        latencyMs: pingResult.latencyMs,
        error: pingResult.error,
        modelDeprecated: pingResult.modelDeprecated,
        orgId,
        projectId,
        keyFingerprint,
      };
    }),
  );

  return NextResponse.json({ checkedAt: new Date().toISOString(), providers: results });
}
