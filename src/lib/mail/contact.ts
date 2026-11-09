/**
 * お問い合わせフォームのメール送信（Resend API）。
 *
 * 従来 /api/contact は console.log のみで実際には送信していなかった。本モジュールで
 * Resend（トランザクションメール配信サービス）を介して運営者の受信メール
 * アドレス（CONTACT_EMAIL）へ問い合わせ内容を送信する。
 *
 * 設定要件:
 * - RESEND_API_KEY: ResendのAPIキー（必須）。未設定時は送信できない。
 * - CONTACT_EMAIL: 問い合わせの送信先（必須）。未設定時は送信できない。
 * - RESEND_FROM_EMAIL: 送信元（From）。Resendで検証済みのドメイン/メールを指定する。
 *   未設定時はResendのテスト用送信元 `onboarding@resend.dev` を使う。ただしこれは
 *   「Resendアカウント所有者自身のメールアドレス宛」にしか送信できないテスト専用の
 *   送信元であり、本番で一般運用する場合は自ドメインを検証して設定すること。
 *
 * fail-closedの方針: 本番環境で設定が揃っていない場合はルート側が503で拒否する
 * （ログインAPIのSMTP未設定時の扱いと同様）。開発環境でのみ、設定なしでも
 * console.log に内容を出力するフォールバックを提供する。
 */

import { Resend } from "resend";

import { APP_NAME } from "@/lib/constants";
import { incrementBucket, resolveAiRateLimitIdentity } from "@/lib/ai/rate-limit";

export type ContactInput = {
  purpose: string;
  name: string;
  email: string;
  company?: string;
  message: string;
};

const DEFAULT_FROM_EMAIL = "onboarding@resend.dev";

function resolveFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_EMAIL?.trim());
}

export async function sendContactEmail(input: ContactInput): Promise<void> {
  if (!isContactEmailConfigured()) {
    throw new Error("Resend is not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_EMAIL!.trim();
  const from = resolveFromEmail();

  const subject = `[${APP_NAME}] お問い合わせ（${input.purpose}）: ${input.name} 様`;
  const text =
    `【お問い合わせ種別】 ${input.purpose}\n` +
    `【お名前】 ${input.name}\n` +
    `【メールアドレス】 ${input.email}\n` +
    `【企業名】 ${input.company?.trim() || "（未入力）"}\n\n` +
    `【お問い合わせ内容】\n${input.message}\n`;

  await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject,
    text,
  });
}

/**
 * お問い合わせ送信自体へのレート制限（スパム防止）。
 * ログイン不要の公開フォームのため、匿名の識別単位（IPハッシュ）で短時間窓あたりの
 * 送信回数を制限する。rate-limit.ts の incrementBucket を再利用し、名前空間
 * "contact" で他の用途（AI/OTP送信）と衝突しないようにする。
 */
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10分
const CONTACT_RATE_LIMIT_MAX_PER_WINDOW = 3;

export async function checkContactRateLimit(
  request: Request,
  now: number = Date.now(),
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const identity = resolveAiRateLimitIdentity(request, null);
  const windowIndex = Math.floor(now / CONTACT_RATE_LIMIT_WINDOW_MS);
  const bucketKey = `contact:${identity.key}:${windowIndex}`;
  const windowResetAt = (windowIndex + 1) * CONTACT_RATE_LIMIT_WINDOW_MS;
  const count = await incrementBucket(bucketKey, windowResetAt, now);

  if (count > CONTACT_RATE_LIMIT_MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowResetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
