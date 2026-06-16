import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { runInvestigation } from "@/lib/investigation/orchestrator";

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