import { NextResponse } from "next/server";

import { getSessionEmail, isAdminEmail } from "@/lib/auth/server";
import { runConfigPreflight } from "@/lib/config/preflight";

export const dynamic = "force-dynamic";

/**
 * 本番投入前の設定プリフライトチェック結果を返す管理者専用API。
 * 設定値そのものは一切含めない（設定名+問題の種類+対処方針のみ）。
 */
export async function GET() {
  const email = await getSessionEmail();
  if (!email || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const report = runConfigPreflight();
  return NextResponse.json(report);
}
