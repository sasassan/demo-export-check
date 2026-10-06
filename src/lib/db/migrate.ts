import path from "node:path";

import { migrate } from "drizzle-orm/postgres-js/migrator";

import { getDbClient } from "@/lib/db/client";

export async function runMigrations() {
  const db = getDbClient();

  if (!db) {
    throw new Error("DATABASE_URL is not set");
  }

  // サーバーレス（Vercel等）では相対パス解決が不安定なため絶対パスで解決する。
  // drizzle/ は next.config.ts の outputFileTracingIncludes でトレースに含めている。
  const migrationsFolder = path.join(process.cwd(), "drizzle");
  await migrate(db, { migrationsFolder });
}
