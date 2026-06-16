import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner, updateCaseChecklist } from "@/lib/db/repository";
import type { ChecklistItem } from "@/lib/types";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/cases/[id]">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const detail = await assertCaseOwner(id, userEmail);

  if (!detail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/cases/[id]">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | { checklist?: ChecklistItem[] }
    | null;

  if (!body?.checklist || !Array.isArray(body.checklist)) {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const updated = await updateCaseChecklist(id, userEmail, body.checklist);

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}