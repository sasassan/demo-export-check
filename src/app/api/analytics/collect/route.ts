import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { createAnalyticsSession, saveAnalyticsEvent } from "@/lib/db/repository";
import type { AnalyticsCollectInput } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCollectPayload(value: unknown): value is AnalyticsCollectInput {
  if (!isRecord(value)) return false;
  if (!isRecord(value.session) || !isRecord(value.event)) return false;
  return (
    typeof value.session.id === "string" &&
    typeof value.session.visitorId === "string" &&
    typeof value.session.entryPath === "string" &&
    typeof value.session.deviceType === "string" &&
    typeof value.session.startedAt === "string" &&
    typeof value.session.lastSeenAt === "string" &&
    typeof value.event.id === "string" &&
    typeof value.event.sessionId === "string" &&
    typeof value.event.visitorId === "string" &&
    typeof value.event.eventName === "string" &&
    typeof value.event.path === "string" &&
    typeof value.event.createdAt === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isCollectPayload(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const userEmail = await getSessionEmail();

  await createAnalyticsSession({
    ...body.session,
    userEmail: userEmail ?? body.session.userEmail,
  });

  await saveAnalyticsEvent({
    ...body.event,
    userEmail: userEmail ?? body.event.userEmail,
  });

  return NextResponse.json({ ok: true });
}