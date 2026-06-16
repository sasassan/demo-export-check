import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { createCaseRecord, listCasesByUser } from "@/lib/db/repository";
import { createCaseSchema } from "@/lib/validation/case";

export async function GET() {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await listCasesByUser(userEmail);
  return NextResponse.json(items);
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

  const record = await createCaseRecord(userEmail, parsed.data);

  return NextResponse.json({
    id: record.id,
  });
}