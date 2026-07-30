import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getAllProviderRuntimeInfo } from "@/lib/ai/config";
import { classifyAiError, logAiError } from "@/lib/ai/error-handling";

export const dynamic = "force-dynamic";

type ProviderHealth = {
  provider: "gpt-4o" | "claude" | "gemini";
  configured: boolean;
  model: string;
  reachable: boolean;
  latencyMs: number | null;
  error?: string;
};

/** 各プロバイダーに極小のping的プロンプトを送り、疎通確認する。APIキーの値は返さない。 */
async function pingOpenAi(apiKey: string, model: string, timeoutMs: number): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = new OpenAI({ apiKey, timeout: timeoutMs });
    await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: "ping" }],
      max_tokens: 1,
    });
    return { reachable: true, latencyMs: Date.now() - start };
  } catch (error) {
    const classified = logAiError("health-openai", error);
    return { reachable: false, latencyMs: Date.now() - start, error: `${classified.kind} (status: ${classified.status ?? "n/a"})` };
  }
}

async function pingClaude(apiKey: string, model: string, timeoutMs: number): Promise<{ reachable: boolean; latencyMs: number; error?: string }> {
  const start = Date.now();
  try {
    const client = new Anthropic({ apiKey, timeout: timeoutMs });
    await client.messages.create({
      model,
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

  const runtimeInfos = getAllProviderRuntimeInfo();

  const results: ProviderHealth[] = await Promise.all(
    runtimeInfos.map(async (info): Promise<ProviderHealth> => {
      const configured = info.status === "live" && Boolean(info.apiKey);

      if (!configured || !info.apiKey) {
        return {
          provider: info.model as "gpt-4o" | "claude" | "gemini",
          configured: false,
          model: info.modelName,
          reachable: false,
          latencyMs: null,
        };
      }

      let pingResult: { reachable: boolean; latencyMs: number; error?: string };
      try {
        if (info.model === "gpt-4o") {
          pingResult = await pingOpenAi(info.apiKey, info.modelName, info.timeoutMs);
        } else if (info.model === "claude") {
          pingResult = await pingClaude(info.apiKey, info.modelName, info.timeoutMs);
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
      };
    }),
  );

  return NextResponse.json({ checkedAt: new Date().toISOString(), providers: results });
}
