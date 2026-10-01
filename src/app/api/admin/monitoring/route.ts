import { NextResponse } from "next/server";
import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getMonitoringMetrics } from "@/lib/admin/monitoring";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const email = await getSessionEmail();
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const cookie = request.headers.get("cookie") ?? undefined;
    const metrics = await getMonitoringMetrics(cookie);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("[admin:monitoring] failed to collect metrics", error);
    return NextResponse.json(
      { error: "Failed to collect monitoring metrics" },
      { status: 500 },
    );
  }
}
