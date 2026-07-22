import { NextResponse } from "next/server";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getAnalyticsSummary } from "@/lib/db/repository";

export async function GET(request: Request) {
  const email = await getSessionEmail();
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const rangeDaysParam = Number(searchParams.get("rangeDays"));
  const rangeDays = Number.isFinite(rangeDaysParam) && rangeDaysParam > 0 ? rangeDaysParam : 30;

  const summary = await getAnalyticsSummary(rangeDays);

  return NextResponse.json(summary);
}
