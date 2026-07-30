import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getAllProviderRuntimeInfo, maskScopeId } from "@/lib/ai/config";
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
  /** Organization/Projectスコープのキーを識別するための情報。値は常にマスク済み。未設定はnull。 */
  orgId: string | null;
  projectId: string | null;
};

/** 各プロバイダーに極小のping的プロンプトを送り、疎通確認する。APIキーの値は返さない。 */
async function pingOpenAi(runtime: ProviderRuntimeInfo): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = createOpenAiClient(runtime);
    await client.chat.completions.create({
      model: runtime.modelName,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    });
    return { reachable: true, latencyMs: Date.now() - start };
  } catch (error) {
    const classified = logAiError("health-openai", error);
    return { reachable: false, latencyMs: Date.now() - start, error: `${classified.kind} (status: ${classified.status ?? "n/a"})` };
  }
}

async function pingClaude(runtime: ProviderRuntimeInfo): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = createAnthropicClient(runtime);
    await client.messages.create({
      model: runtime.modelName,
      max_tokens: 1,
      messages: [{ role: "user", content: "ping" }],
    });
    return { reachable: true, latencyMs: Date.now() - start };
  } catch (error) {
    const classified = logAiError("health-claude", error);
    return { reachable: false, latencyMs: Date.now() - start, error: `${classified.kind} (status: ${classified.status ?? "n/a"})` };
  }
}

async function pingGemini(apiKey: string, model: string, timeoutMs: number): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model }, { timeout: timeoutMs });
    await genModel.generateContent("ping");
    return { reachable: true, latencyMs: Date.now() - start };
  } catch (error) {
    const classified = logAiError("health-gemini", error);
    return { reachable: false, latencyMs: Date.now() - start, error: `${classified.kind} (status: ${classified.status ?? "n/a"})` };
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

      if (!configured || !info.apiKey) {
        return {
          provider: info.model as "gpt-4o" | "claude" | "gemini",
          configured: false,
          model: info.modelName,
          reachable: false,
          latencyMs: null,
          orgId,
          projectId,
        };
      }

      let pingResult: { reachable: boolean; latencyMs: number; error?: string };
      try {
        if (info.model === "gpt-4o") {
          pingResult = await pingOpenAi(info);
        } else if (info.model === "claude") {
          pingResult = await pingClaude(info);
        } else if (info.model === "gemini") {
          pingResult = await pingGemini(info.apiKey, info.modelName, info.timeoutMs);
        } else {
          pingResult = { reachable: false, latencyMs: 0, error: "unsupported provider" };
        }
      } catch (error) {
        const classified = classifyAiError(error);
        pingResult = { reachable: false, latencyMs: 0, error: `${classified.kind} (status: ${classified.status ?? "n/a"})` };
      }

      return {
        provider: info.model as "gpt-4o" | "claude" | "gemini",
        configured: true,
        model: info.modelName,
        reachable: pingResult.reachable,
        latencyMs: pingResult.latencyMs,
        error: pingResult.error,
        orgId,
        projectId,
      };
    }),
  );

  return NextResponse.json({ checkedAt: new Date().toISOString(), providers: results });
}
