import { NextResponse } from "next/server";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { assertCaseOwner, getCaseOwnerInfo, softDeleteCase, updateCaseChecklist } from "@/lib/db/repository";
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

/**
 * 案件の論理削除。
 * 認可: 作成者本人 または 管理者（isAdminEmail）のみ。
 * 該当案件が存在しない、またはすでに削除済みの場合は404（存在しない案件との区別をせず、
 * 他案件の情報や内部状態を推測されないようにする）。
 */
export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/cases/[id]">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const owner = await getCaseOwnerInfo(id);

  if (!owner || owner.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (owner.userEmail !== userEmail && !isAdminEmail(userEmail)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await softDeleteCase(id, userEmail);

  if (!result) {
    // 認可チェックと削除実行の間で状態が変わった場合（同時実行など）。
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id: result.id, deletedAt: result.deletedAt });
}