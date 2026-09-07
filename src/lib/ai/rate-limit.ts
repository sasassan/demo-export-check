/**
 * AI実行APIのコスト暴走ガード（レート制限）。
 *
 * 目的: 認証済み利用者（またはIPベースの匿名識別単位）ごとに、
 * (1) 短時間の連続リクエストを抑制する「窓(window)制限」と
 * (2) 1日あたりの合計呼び出し数を抑制する「日次上限」を適用し、
 * 想定外の高頻度呼び出しによるAI APIコスト暴走を防ぐ。
 *
 * 識別単位:
 * - 認証済み利用者: セッションのメールアドレス（正規化して小文字化）。
 * - 匿名利用: クライアントIP（x-forwarded-for / x-real-ip）をsha256でハッシュ化した値。
 *   注意: これはベストエフォートの識別であり、リバースプロキシ/CDN（Vercel等）が
 *   x-forwarded-forを信頼できる形で付与する環境を前提とする。アプリ自身は
 *   どのプロキシホップを信頼するかを検証する手段を持たないため、ヘッダーを
 *   偽装したリクエストを完全には排除できない。これは既存インフラを変更しない
 *   P0段階の現実的な妥協点であり、既知の残存リスクとして文書化する
 *   （docs/rate-limit-guard.md 参照）。
 *
 * 永続化と水平スケール:
 * - DATABASE_URLが設定されている場合、Postgresの `ai_rate_limit_buckets` テーブルに
 *   UPSERT(ON CONFLICT DO UPDATE)で原子的にカウントを増加させる。複数インスタンスが
 *   同一DBを参照するため、水平スケール環境でも制限が正しく共有される。
 * - DATABASE_URLが未設定の場合（ローカル開発・DB未接続環境）は、プロセス内メモリの
 *   Mapにフォールバックする。この場合はインスタンスごとに独立したカウントになり、
 *   複数インスタンス環境では制限が正しく共有されない（P0の既知の限界。詳細はdocs参照）。
 */

import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";

import { getDbClient } from "@/lib/db/client";
import { aiRateLimitBuckets } from "@/lib/db/schema";

export type RateLimitIdentity =
  | { type: "user"; key: string }
  | { type: "anon"; key: string };

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; scope: "window" | "day"; retryAfterSeconds: number };

export type AiRateLimitConfig = {
  windowMs: number;
  userWindowMax: number;
  anonWindowMax: number;
  userDailyMax: number;
  anonDailyMax: number;
};

const DEFAULTS: AiRateLimitConfig = {
  windowMs: 60_000,
  userWindowMax: 5,
  anonWindowMax: 2,
  userDailyMax: 50,
  anonDailyMax: 8,
};

/**
 * 環境変数から安全に整数値を読み取る。未設定・数値でない・最小許容値未満の場合は
 * 警告ログを出しデフォルト値にフォールバックする（誤って極端に小さい値/0/負値が
 * 紛れ込みAI機能が実質停止する事故を避けるための安全側バリデーション）。
 */
function readIntEnv(key: string, defaultValue: number, min: number): number {
  const raw = process.env[key];
  if (!raw || raw.trim().length === 0) return defaultValue;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < min) {
    console.warn(
      `[AI:rate-limit] ${key}="${raw}" は不正または小さすぎる値のため無視し、デフォルト値(${defaultValue})にフォールバックします（最小許容値: ${min}）`,
    );
    return defaultValue;
  }
  return Math.floor(parsed);
}

export function getAiRateLimitConfig(): AiRateLimitConfig {
  return {
    windowMs: readIntEnv("AI_RATE_LIMIT_WINDOW_MS", DEFAULTS.windowMs, 1_000),
    userWindowMax: readIntEnv("AI_RATE_LIMIT_MAX_PER_WINDOW", DEFAULTS.userWindowMax, 1),
    anonWindowMax: readIntEnv("AI_RATE_LIMIT_ANON_MAX_PER_WINDOW", DEFAULTS.anonWindowMax, 1),
    userDailyMax: readIntEnv("AI_RATE_LIMIT_DAILY_MAX", DEFAULTS.userDailyMax, 1),
    anonDailyMax: readIntEnv("AI_RATE_LIMIT_ANON_DAILY_MAX", DEFAULTS.anonDailyMax, 1),
  };
}

/** APIキーと同様、識別子の値そのものはログに出さない前提のハッシュ化ヘルパー。 */
export function hashIdentitySecret(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function extractClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) return realIp.trim();
  return null;
}

/**
 * 識別単位を解決する。認証済みならセッションメールを、匿名なら
 * IPアドレスのハッシュ値を使う。IPが一切取得できない場合は
 * 全匿名利用者共通の固定バケットにフォールバックする（識別不能でも
 * 何らかの上限は適用され、無制限にはならないようにするため）。
 */
export function resolveAiRateLimitIdentity(
  request: Request,
  sessionEmail: string | null | undefined,
): RateLimitIdentity {
  const normalizedEmail = sessionEmail?.trim().toLowerCase();
  if (normalizedEmail) {
    return { type: "user", key: normalizedEmail };
  }
  const ip = extractClientIp(request);
  return { type: "anon", key: hashIdentitySecret(ip ?? "unknown-ip") };
}

function buildWindowBucketKey(identity: RateLimitIdentity, now: number, windowMs: number): string {
  const windowIndex = Math.floor(now / windowMs);
  return `w:${identity.type}:${identity.key}:${windowIndex}`;
}

function buildDayBucketKey(identity: RateLimitIdentity, now: number): string {
  const dateKey = new Date(now).toISOString().slice(0, 10); // UTC日付 YYYY-MM-DD
  return `d:${identity.type}:${identity.key}:${dateKey}`;
}

function nextUtcMidnight(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
}

declare global {
  var __aiRateLimitMemoryStore: Map<string, { count: number; expiresAt: number }> | undefined;
}

function getMemoryStore(): Map<string, { count: number; expiresAt: number }> {
  if (!globalThis.__aiRateLimitMemoryStore) {
    globalThis.__aiRateLimitMemoryStore = new Map();
  }
  return globalThis.__aiRateLimitMemoryStore;
}

function incrementBucketMemory(bucketKey: string, expiresAtMs: number, now: number): number {
  const store = getMemoryStore();
  const existing = store.get(bucketKey);
  if (!existing || existing.expiresAt <= now) {
    store.set(bucketKey, { count: 1, expiresAt: expiresAtMs });
    return 1;
  }
  existing.count += 1;
  return existing.count;
}

async function incrementBucketDb(bucketKey: string, expiresAtMs: number): Promise<number> {
  const db = getDbClient();
  if (!db) {
    throw new Error("incrementBucketDb called without a database client");
  }
  const now = new Date();
  const expiresAt = new Date(expiresAtMs);
  const rows = await db
    .insert(aiRateLimitBuckets)
    .values({ bucketKey, count: 1, expiresAt, updatedAt: now })
    .onConflictDoUpdate({
      target: aiRateLimitBuckets.bucketKey,
      set: {
        count: sql`${aiRateLimitBuckets.count} + 1`,
        expiresAt,
        updatedAt: now,
      },
    })
    .returning({ count: aiRateLimitBuckets.count });
  return rows[0]?.count ?? 1;
}

async function incrementBucket(bucketKey: string, expiresAtMs: number, now: number): Promise<number> {
  const db = getDbClient();
  if (db) {
    return incrementBucketDb(bucketKey, expiresAtMs);
  }
  return incrementBucketMemory(bucketKey, expiresAtMs, now);
}

/**
 * AI実行リクエストに対してレート制限を評価し、カウントを消費する。
 * 短時間窓・日次上限の両方をこの1回の呼び出しで判定する（呼び出し側は
 * 1リクエストにつき1回だけ呼ぶこと）。
 */
export async function checkAiRateLimit(
  identity: RateLimitIdentity,
  now: number = Date.now(),
): Promise<RateLimitDecision> {
  const config = getAiRateLimitConfig();
  const windowMax = identity.type === "user" ? config.userWindowMax : config.anonWindowMax;
  const dailyMax = identity.type === "user" ? config.userDailyMax : config.anonDailyMax;

  const windowResetAt = (Math.floor(now / config.windowMs) + 1) * config.windowMs;
  const windowKey = buildWindowBucketKey(identity, now, config.windowMs);
  const windowCount = await incrementBucket(windowKey, windowResetAt, now);
  if (windowCount > windowMax) {
    return {
      allowed: false,
      scope: "window",
      retryAfterSeconds: Math.max(1, Math.ceil((windowResetAt - now) / 1000)),
    };
  }

  const dayResetAt = nextUtcMidnight(now);
  const dayKey = buildDayBucketKey(identity, now);
  const dayCount = await incrementBucket(dayKey, dayResetAt, now);
  if (dayCount > dailyMax) {
    return {
      allowed: false,
      scope: "day",
      retryAfterSeconds: Math.max(1, Math.ceil((dayResetAt - now) / 1000)),
    };
  }

  return { allowed: true };
}

/**
 * 429応答用の安全なメッセージとステータス情報を組み立てる。
 * APIキー・内部例外・他利用者の使用量などは一切含めない。
 */
export function toRateLimitErrorPayload(decision: Extract<RateLimitDecision, { allowed: false }>) {
  const message =
    decision.scope === "day"
      ? "本日のAI利用回数の上限に達しました。しばらく時間をおいてから再度お試しください。"
      : "短時間にリクエストが集中しました。しばらく時間をおいてから再度お試しください。";
  return {
    status: 429 as const,
    retryAfterSeconds: decision.retryAfterSeconds,
    body: { error: message } as const,
  };
}

/** テスト専用: プロセス内メモリストアをクリアする。本番コードパスからは呼ばない。 */
export function __resetAiRateLimitMemoryStoreForTests(): void {
  globalThis.__aiRateLimitMemoryStore = new Map();
}
