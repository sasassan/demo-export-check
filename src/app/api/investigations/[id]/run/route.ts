import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { runInvestigation } from "@/lib/investigation/orchestrator";

// Vercel Pro: 60s / Hobby: 10s（高速モデルで3AI並列実行に対応）
export const maxDuration = 60;

export async function POST(
  _request: Request,
  context: RouteContext<"/api/investigations/[id]/run">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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