import { NextResponse } from "next/server";
import { z } from "zod";

import { createSessionCookieValue, isAdminEmail } from "@/lib/auth/server";
import { checkOtpSendRateLimit, issueOtpCode } from "@/lib/auth/otp";
import { isSmtpConfigured, sendOtpEmail } from "@/lib/mail/sender";
import { setSessionCookie } from "@/lib/auth/session-cookie";

const loginSchema = z.object({
  email: z.email("正しいメールアドレスを入力してください。"),
});

function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * ログインAPI（第1段階: メール確認コード発行）。
 *
 * 本番E2Eで発見されたBlocker対応: 以前はここで直接セッションを発行していたため、
 * 任意のメール文字列（管理者メールを含む）を送るだけで即座にログインできてしまっていた。
 * 現在はここではセッションを発行せず、OTPコードをメールで送るところまでを行う。
 * 実際のセッション発行は検証後の /api/auth/verify のみが行う。
 *
 * fail-closedの方針: 本番でSMTPが未設定の場合、検証なしの新規ログインを
 * 一切許可しない（503を返す）。開発環境かつSMTP未設定の場合のみ、
 * 管理者以外は従来のパスワードレス即時ログイン動作を維持する
 * （ローカル開発の利便性のため。管理者は開発環境でも常にOTP+パスワードの
 * 二要素フローを通す）。
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const smtpConfigured = isSmtpConfigured();
  const admin = isAdminEmail(email);

  if (isProductionEnv() && !smtpConfigured) {
    console.error(
      "[auth:login] 本番環境でSMTPが未設定のため、新規ログインをfail-closedで拒否しました。",
    );
    return NextResponse.json(
      { error: "現在ログイン機能をご利用いただけません。しばらく時間をおいて再度お試しください。" },
      { status: 503 },
    );
  }

  if (!isProductionEnv() && !smtpConfigured && !admin) {
    // 開発環境の利便性維持: SMTP未設定時は非管理者に限りパスワードレス即時ログインを維持する。
    const cookieValue = await createSessionCookieValue(email);
    await setSessionCookie(cookieValue);
    return NextResponse.json({ ok: true });
  }

  const rateLimit = await checkOtpSendRateLimit(email);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "確認コードの送信回数が多すぎます。しばらく時間をおいて再度お試しください。" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { code } = await issueOtpCode(email, "login");

  if (smtpConfigured) {
    try {
      await sendOtpEmail(email, code);
    } catch (error) {
      console.error("[auth:login] OTPメール送信に失敗しました。", error);
      return NextResponse.json(
        { error: "確認コードの送信に失敗しました。しばらく時間をおいて再度お試しください。" },
        { status: 503 },
      );
    }
  } else {
    // 開発環境でSMTP未設定のまま管理者ログインを試すためのフォールバック（メールは送らない）。
    console.warn(`[auth:login] SMTP未設定のため開発用にコードをコンソール出力します: ${email} -> ${code}`);
  }

  return NextResponse.json({ verificationRequired: true });
}
