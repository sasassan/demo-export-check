import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { runInvestigation } from "@/lib/investigation/orchestrator";
import { getCaseOwnerInfo, tryStartInvestigation } from "@/lib/db/repository";
import { withDbErrorHandling } from "@/lib/db/errors";
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

  return withDbErrorHandling(async () => {
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

    const owner = await getCaseOwnerInfo(id);
    if (!owner || owner.deletedAt || owner.userEmail !== userEmail) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 同一案件への調査並列実行防止（本番E2EのMajor①対応）:
    // 開始権の取得を原子的なUPDATEで行い、既にrunning中なら即座に409を返す
    // （進行中ジョブの完了待ちはしない）。詳細は repository.ts の
    // tryStartInvestigation のコメントを参照。
    const startResult = await tryStartInvestigation(id);
    if (startResult === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (startResult === "already_running") {
      return NextResponse.json(
        { error: "この案件は調査実行中です。" },
        { status: 409 },
      );
    }

    const detail = await runInvestigation(id, userEmail);

    if (!detail) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      status: detail.investigation?.status,
    });
  });
}
