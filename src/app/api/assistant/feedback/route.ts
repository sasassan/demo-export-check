import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { updateConsultationFeedback } from "@/lib/db/repository";

export async function POST(request: Request) {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const consultationId =
    typeof body === "object" && body && "consultationId" in body
      ? String((body as Record<string, unknown>).consultationId ?? "")
      : "";
  const feedback =
    typeof body === "object" && body && "feedback" in body
      ? String((body as Record<string, unknown>).feedback ?? "")
      : "";
  const feedbackComment =
    typeof body === "object" && body && "feedbackComment" in body
      ? String((body as Record<string, unknown>).feedbackComment ?? "")
      : undefined;

  if (!consultationId || !["helpful", "needs-work"].includes(feedback)) {
    return NextResponse.json({ error: "入力内容を確認してください" }, { status: 400 });
  }

  const updated = await updateConsultationFeedback(
    consultationId,
    userEmail,
    feedback as "helpful" | "needs-work",
    feedbackComment,
  );

  if (!updated) {
    return NextResponse.json({ error: "対象の相談履歴が見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}