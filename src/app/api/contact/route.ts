import { NextResponse } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

import { checkContactRateLimit, isContactEmailConfigured, sendContactEmail } from "@/lib/mail/contact";

const contactSchema = z.object({
  purpose: z.string().trim().max(100).optional(),
  name: z.string().trim().min(1, "お名前を入力してください。").max(200),
  email: z.email("正しいメールアドレスを入力してください。"),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください。").max(10000),
});

function isProductionEnv(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * お問い合わせフォームの送信API。
 *
 * 1. 入力値をzodで検証する。
 * 2. IPベースのレート制限（スパム防止）を適用する。
 * 3. Resendで CONTACT_EMAIL 宛に問い合わせ内容を送信する。
 *
 * 本番で Resend の設定（RESEND_API_KEY / CONTACT_EMAIL）が揃っていない場合は
 * fail-closedで503を返す。開発環境では設定なしの場合に限り console.log への
 * 出力フォールバックを提供する（メール送信はしない）。
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません。" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const rateLimit = await checkContactRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "送信回数が多すぎます。しばらく時間をおいて再度お試しください。" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  if (!isContactEmailConfigured()) {
    if (isProductionEnv()) {
      console.error(
        "[contact] RESEND_API_KEY または CONTACT_EMAIL が未設定のため、お問い合わせ送信をfail-closedで拒否しました。",
      );
      return NextResponse.json(
        { error: "現在お問い合わせを送信できません。しばらく時間をおいて再度お試しください。" },
        { status: 503 },
      );
    }

    console.log("[Contact]", {
      purpose: data.purpose,
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    await sendContactEmail({
      purpose: data.purpose ?? "その他",
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    });
  } catch (error) {
    console.error("[contact] お問い合わせメール送信に失敗しました。", error);
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらく時間をおいて再度お試しください。" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
