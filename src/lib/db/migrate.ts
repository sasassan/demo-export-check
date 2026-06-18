import { migrate } from "drizzle-orm/postgres-js/migrator";

import { getDbClient } from "@/lib/db/client";

export async function runMigrations() {
  const db = getDbClient();

  if (!db) {
    throw new Error("DATABASE_URL is not set");
  }

  await migrate(db, { migrationsFolder: "drizzle" });
}
