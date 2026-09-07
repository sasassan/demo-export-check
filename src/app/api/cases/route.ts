import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { createCaseRecord, listCasesByUser, markConsultationAsCased } from "@/lib/db/repository";
import { withDbErrorHandling } from "@/lib/db/errors";
import { createCaseSchema } from "@/lib/validation/case";

export async function GET() {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withDbErrorHandling(async () => {
    const items = await listCasesByUser(userEmail);
    return NextResponse.json(items);
  });
}

export async function POST(request: Request) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = createCaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      },
      { status: 400 },
    );
  }

  return withDbErrorHandling(async () => {
    const record = await createCaseRecord(userEmail, parsed.data);

    const consultationId = typeof body === "object" && body && "consultationId" in body ? String((body as Record<string, unknown>).consultationId ?? "") : "";
    if (consultationId) {
      await markConsultationAsCased(consultationId, record.id);
    }

    return NextResponse.json({
      id: record.id,
    });
  });
}
