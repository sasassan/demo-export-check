/**
 * メール確認コード（OTP）によるログイン検証。
 *
 * 本番E2Eで発見されたBlocker「メール確認なしの即時セッション発行」への対応。
 * 以前は POST /api/auth/login に任意のメール文字列を送るだけで即座にセッションが
 * 発行されていた（管理者メールを入力すれば誰でも管理者になれた）。
 * このモジュールは「6桁のワンタイムコードをメールで送り、検証成功時にのみ
 * セッションを発行する」ためのコード生成・保存・検証を提供する。
 *
 * 値の扱い:
 * - コードそのものはDBに保存しない。サーバー秘密鍵によるHMAC-SHA256ハッシュのみ保存する
 *   （DBを閲覧できる者がコードを直接読み取れないようにするため）。
 * - 有効期限（既定8分）を過ぎたコード、または既に使用済み（consumedAt設定済み）の
 *   コードは無効。
 * - 誤入力の試行回数（attempts）が上限を超えたコードも無効化する（総当たり対策）。
 *
 * 永続化: DATABASE_URL設定時はPostgresの`otp_codes`テーブルを使う。未設定時
 * （ローカル開発）はプロセス内メモリにフォールバックする（repository.tsの
 * インメモリ実装と同じ設計方針）。
 */

import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { eq, and } from "drizzle-orm";

import { getDbClient } from "@/lib/db/client";
import { otpCodes } from "@/lib/db/schema";
import { createId } from "@/lib/utils";
import { incrementBucket } from "@/lib/ai/rate-limit";

export type OtpPurpose = "login";

const OTP_CODE_LENGTH = 6;
export const OTP_EXPIRY_MS = 8 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

/**
 * OTPハッシュ化に使う秘密鍵。専用のOTP_HASH_SECRETがあればそれを使い、
 * なければSESSION_SECRETを流用する（rate-limit.tsのRATE_LIMIT_HASH_SECRET解決と
 * 同様の優先順位パターン）。いずれも未設定の場合は固定の開発用フォールバック値。
 */
const DEV_FALLBACK_OTP_SECRET = "export-risk-navigator-insecure-dev-fallback-otp-secret";

function resolveOtpHashSecret(): string {
  const dedicated = process.env.OTP_HASH_SECRET?.trim();
  if (dedicated) return dedicated;
  const sessionSecret = process.env.SESSION_SECRET?.trim();
  if (sessionSecret) return sessionSecret;
  return DEV_FALLBACK_OTP_SECRET;
}

function hashOtpCode(email: string, purpose: OtpPurpose, code: string): string {
  const secret = resolveOtpHashSecret();
  return createHmac("sha256", secret).update(`${email}:${purpose}:${code}`).digest("hex");
}

function generateOtpCode(): string {
  return randomInt(0, 10 ** OTP_CODE_LENGTH).toString().padStart(OTP_CODE_LENGTH, "0");
}

/** 長さの違いによるタイミング差を出さないよう、両者を固定長ハッシュ化してから比較する。 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

type OtpRecord = {
  id: string;
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  attempts: number;
  expiresAt: number;
  consumedAt: number | null;
};

declare global {
  var __ernOtpMemoryStore: Map<string, OtpRecord> | undefined;
}

function getMemoryStore(): Map<string, OtpRecord> {
  if (!globalThis.__ernOtpMemoryStore) {
    globalThis.__ernOtpMemoryStore = new Map();
  }
  return globalThis.__ernOtpMemoryStore;
}

function memoryKey(email: string, purpose: OtpPurpose): string {
  return `${purpose}:${email}`;
}

/**
 * 新しいOTPコードを発行し、ハッシュを保存する。
 * 同一email+purposeの既存コードは（未使用でも）上書きされ、無効になる
 * （常に「直近1件のみ」が有効なコードという単純なモデル）。
 * 戻り値のcodeは呼び出し側がメール送信に使うためのものであり、DBには保存しない。
 */
export async function issueOtpCode(
  email: string,
  purpose: OtpPurpose = "login",
): Promise<{ code: string }> {
  const code = generateOtpCode();
  const codeHash = hashOtpCode(email, purpose, code);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MS);

  const db = getDbClient();
  if (db) {
    await db
      .delete(otpCodes)
      .where(and(eq(otpCodes.email, email), eq(otpCodes.purpose, purpose)));
    await db.insert(otpCodes).values({
      id: createId("otp"),
      email,
      purpose,
      codeHash,
      attempts: 0,
      expiresAt,
      createdAt: now,
    });
    return { code };
  }

  const store = getMemoryStore();
  store.set(memoryKey(email, purpose), {
    id: createId("otp"),
    email,
    purpose,
    codeHash,
    attempts: 0,
    expiresAt: expiresAt.getTime(),
    consumedAt: null,
  });
  return { code };
}

export type OtpVerifyResult = "ok" | "invalid" | "expired" | "too_many_attempts";

/**
 * OTPコードを検証する。成功時はコードを消費済み（再利用不可）にする。
 * 失敗時（コード不一致）は試行回数を1件加算し、上限を超えたコードは
 * 以後常に"too_many_attempts"を返す（総当たり対策）。
 */
export async function verifyOtpCode(
  email: string,
  code: string,
  purpose: OtpPurpose = "login",
): Promise<OtpVerifyResult> {
  const db = getDbClient();

  if (db) {
    const existing = (
      await db
        .select()
        .from(otpCodes)
        .where(and(eq(otpCodes.email, email), eq(otpCodes.purpose, purpose)))
        .limit(1)
    )[0];

    if (!existing || existing.consumedAt) {
      return "invalid";
    }
    if (existing.attempts >= OTP_MAX_ATTEMPTS) {
      return "too_many_attempts";
    }
    if (existing.expiresAt.getTime() < Date.now()) {
      return "expired";
    }

    const providedHash = hashOtpCode(email, purpose, code);
    const matches = timingSafeEqualStrings(existing.codeHash, providedHash);

    if (!matches) {
      await db
        .update(otpCodes)
        .set({ attempts: existing.attempts + 1 })
        .where(eq(otpCodes.id, existing.id));
      return "invalid";
    }

    await db
      .update(otpCodes)
      .set({ consumedAt: new Date() })
      .where(eq(otpCodes.id, existing.id));
    return "ok";
  }

  const store = getMemoryStore();
  const key = memoryKey(email, purpose);
  const existing = store.get(key);

  if (!existing || existing.consumedAt) {
    return "invalid";
  }
  if (existing.attempts >= OTP_MAX_ATTEMPTS) {
    return "too_many_attempts";
  }
  if (existing.expiresAt < Date.now()) {
    return "expired";
  }

  const providedHash = hashOtpCode(email, purpose, code);
  const matches = timingSafeEqualStrings(existing.codeHash, providedHash);

  if (!matches) {
    existing.attempts += 1;
    return "invalid";
  }

  existing.consumedAt = Date.now();
  return "ok";
}

/** テスト専用: インメモリストアを初期化し直す。本番コードパスからは呼ばない。 */
export function __resetOtpMemoryStoreForTests(): void {
  globalThis.__ernOtpMemoryStore = new Map();
}

export { timingSafeEqualStrings };

/**
 * コード送信自体へのレート制限（メール爆撃防止）。
 * 同一メールアドレスに対して短時間窓あたりの送信回数を制限する。
 * rate-limit.tsのincrementBucketを再利用し、名前空間"otp-send"で衝突を避ける。
 */
const OTP_SEND_WINDOW_MS = 10 * 60 * 1000; // 10分
const OTP_SEND_MAX_PER_WINDOW = 3;

export async function checkOtpSendRateLimit(
  email: string,
  now: number = Date.now(),
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const windowIndex = Math.floor(now / OTP_SEND_WINDOW_MS);
  const bucketKey = `otp-send:${email}:${windowIndex}`;
  const windowResetAt = (windowIndex + 1) * OTP_SEND_WINDOW_MS;
  const count = await incrementBucket(bucketKey, windowResetAt, now);

  if (count > OTP_SEND_MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowResetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
