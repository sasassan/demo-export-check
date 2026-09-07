import { NextResponse } from "next/server";
import { z } from "zod";

import { createSessionCookieValue, isAdminEmail } from "@/lib/auth/server";
import { setSessionCookie } from "@/lib/auth/session-cookie";
import { timingSafeEqualStrings, verifyOtpCode } from "@/lib/auth/otp";

const verifySchema = z.object({
  email: z.email("正しいメールアドレスを入力してください。"),
  code: z.string().regex(/^\d{6}$/, "確認コードは6桁の数字で入力してください。"),
  password: z.string().optional(),
});

const GENERIC_INVALID_MESSAGE = "コードが正しくないか、有効期限が切れています。";

/**
 * ログインAPI（第2段階: OTPコード検証 + セッション発行）。
 *
 * 管理者メールでのログインは追加でADMIN_PASSWORDの一致を要求する（二要素化）。
 * ADMIN_PASSWORDが本番で未設定の場合は、管理者ログインをfail-closedで拒否する
 * （設定漏れのまま「パスワードなしで管理者になれる」状態を作らないため）。
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const result = await verifyOtpCode(email, parsed.data.code, "login");

  if (result !== "ok") {
    return NextResponse.json({ error: GENERIC_INVALID_MESSAGE }, { status: 401 });
  }

  if (isAdminEmail(email)) {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      console.error(
        "[auth:verify] ADMIN_PASSWORDが未設定のため、管理者ログインをfail-closedで拒否しました。",
      );
      return NextResponse.json(
        { error: "管理者ログインは現在利用できません。管理者にお問い合わせください。" },
        { status: 503 },
      );
    }

    const provided = parsed.data.password ?? "";
    if (!timingSafeEqualStrings(provided, expected)) {
      return NextResponse.json({ error: GENERIC_INVALID_MESSAGE }, { status: 401 });
    }
  }

  const cookieValue = await createSessionCookieValue(email);
  await setSessionCookie(cookieValue);

  return NextResponse.json({ ok: true });
}
