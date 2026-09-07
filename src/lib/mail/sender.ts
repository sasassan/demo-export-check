/**
 * OTPコードのメール送信（nodemailer + SMTP）。
 *
 * SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSがすべて設定されている場合のみ
 * 「設定済み」とみなす。未設定の場合、本番ではログインAPI側がfail-closed
 * （新規ログインを拒否）し、このモジュールの送信関数は呼ばれない。
 * 開発環境でSMTP未設定のまま管理者ログインを試す場合のみ、コードを
 * コンソールに出力する開発用フォールバックを提供する（メール送信はしない）。
 */

import nodemailer, { type Transporter } from "nodemailer";

import { APP_NAME } from "@/lib/constants";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const port = Number(process.env.SMTP_PORT);
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : 587,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return cachedTransporter;
}

/**
 * OTPコードをメールで送信する。呼び出し前にisSmtpConfigured()を確認すること
 * （未設定の場合はここで例外を投げる）。
 */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  if (!isSmtpConfigured()) {
    throw new Error("SMTP is not configured");
  }

  const transporter = getTransporter();
  const from = process.env.SMTP_USER;

  await transporter.sendMail({
    from: `${APP_NAME} <${from}>`,
    to: email,
    subject: `[${APP_NAME}] ログイン確認コード: ${code}`,
    text:
      `ログイン確認コードは ${code} です。\n\n` +
      `このコードは発行から8分間有効で、1回のみ使用できます。\n` +
      `このログインに心当たりがない場合は、本メールを無視してください。`,
  });
}
