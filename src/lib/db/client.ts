import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const databaseUrl = process.env.DATABASE_URL;

/**
 * 接続プールをモジュール/プロセス単位でシングルトン化する。
 *
 * 背景（本番Neon接続枯渇の根本原因）: 以前は getDbClient() が呼ばれるたびに
 * postgres(...) を新規実行しており、これは呼び出しごとに新しい接続プール
 * （postgresパッケージの既定max=10）を生成していた。repository.ts の各関数は
 * リクエスト内で複数回 getDb() を呼ぶため、同時リクエストが増えるとプール自体が
 * 掛け算的に増殖し、Neon側の総接続数上限をすぐに超えてしまっていた。
 * globalThis にキャッシュして「プロセスにつき1プールのみ」にすることで、
 * DATABASE_POOL_MAX（既定5）が実際の上限として機能するようにする。
 * Next.jsのdev hot-reloadでも同じグローバルキャッシュパターン（repository.tsの
 * __ernRepoStateと同様）を使い、多重生成を避ける。
 */
declare global {
  var __ernDrizzleDb: ReturnType<typeof drizzle> | undefined;
}

function readPositiveIntEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function getDbClient() {
  if (!databaseUrl) {
    return null;
  }

  if (!globalThis.__ernDrizzleDb) {
    const client = postgres(databaseUrl, {
      prepare: false,
      // プーラー（Neon -pooler / pgBouncer transactionモード等）経由でも安全に動く
      // 控えめな上限。AI調査の同時実行が多いエンドポイントでも、アプリ側プールが
      // Postgres/プーラー側の上限を圧迫しないようにする。
      max: readPositiveIntEnv("DATABASE_POOL_MAX", 5),
      idle_timeout: readPositiveIntEnv("DATABASE_IDLE_TIMEOUT_SECONDS", 20),
      connect_timeout: readPositiveIntEnv("DATABASE_CONNECT_TIMEOUT_SECONDS", 10),
    });
    globalThis.__ernDrizzleDb = drizzle(client);
  }

  return globalThis.__ernDrizzleDb;
}