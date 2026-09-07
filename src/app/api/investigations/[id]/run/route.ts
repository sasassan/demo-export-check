import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { runInvestigation } from "@/lib/investigation/orchestrator";
import {
  checkAiRateLimit,
  resolveAiRateLimitIdentity,
  toRateLimitErrorPayload,
} from "@/lib/ai/rate-limit";

// Vercel Pro: 60s / Hobby: 10s（高速モデルで3AI並列実行に対応）
export const maxDuration = 60;

export async function POST(
  request: Request,
  context: RouteContext<"/api/investigations/[id]/run">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // AI APIコスト暴走ガード: 1回の調査実行で3AIプロバイダー+ナレーション生成が
  // 走る高コスト経路のため、利用者単位で短時間窓/日次上限を適用する。
  const identity = resolveAiRateLimitIdentity(request, userEmail);
  const decision = await checkAiRateLimit(identity);
  if (!decision.allowed) {
    const payload = toRateLimitErrorPayload(decision);
    return NextResponse.json(payload.body, {
      status: payload.status,
      headers: { "Retry-After": String(payload.retryAfterSeconds) },
    });
  }

  const { id } = await context.params;
  const detail = await runInvestigation(id, userEmail);

  if (!detail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    status: detail.investigation?.status,
  });
}