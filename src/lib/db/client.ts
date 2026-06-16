import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const databaseUrl = process.env.DATABASE_URL;

export function getDbClient() {
  if (!databaseUrl) {
    return null;
  }

  const client = postgres(databaseUrl, {
    prepare: false,
  });

  return drizzle(client);
}