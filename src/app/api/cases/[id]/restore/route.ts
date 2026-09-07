import { NextResponse } from "next/server";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { getCaseOwnerInfo, restoreCase } from "@/lib/db/repository";
import { withDbErrorHandling } from "@/lib/db/errors";

/**
 * 論理削除された案件の復元。
 * 認可: 作成者本人 または 管理者のみ。猶予期間（30日）を過ぎている場合は復元不可。
 * レスポンスには顧客情報・他案件の情報・内部例外を含めない。
 */
export async function POST(
  _request: Request,
  context: RouteContext<"/api/cases/[id]/restore">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withDbErrorHandling(async () => {
    const { id } = await context.params;
    const owner = await getCaseOwnerInfo(id);

    if (!owner || !owner.deletedAt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (owner.userEmail !== userEmail && !isAdminEmail(userEmail)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await restoreCase(id, userEmail);

    if (result === "not_found") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (result === "expired") {
      return NextResponse.json(
        { error: "猶予期間を過ぎているため復元できません。" },
        { status: 410 },
      );
    }

    return NextResponse.json({ ok: true, id });
  });
}
