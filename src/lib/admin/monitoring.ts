import { getDbClient } from "@/lib/db/client";
import {
  aiConsultations,
  analyticsEvents,
  analyticsSessions,
  auditLogs,
  cases,
  providerRuns,
} from "@/lib/db/schema";
import { and, count, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";

const CACHE_TTL_MS = 5 * 60 * 1000;

type MonitoringCache = {
  timestamp: number;
  data: MonitoringMetrics;
};

declare global {
  var __ernMonitoringCache: MonitoringCache | undefined;
}

export type MonitoringMetrics = {
  collectedAt: string;
  cases: {
    total: number;
    last24h: number;
    last7d: number;
    last30d: number;
    byStatus: Record<string, number>;
    previousPeriodTotal: number;
  };
  aiUsage: {
    byProvider: Record<
      string,
      {
        calls: number;
        successCount: number;
        avgLatencyMs: number | null;
        fallbackCount: number;
      }
    >;
    totalCalls: number;
    totalFallbacks: number;
  };
  auth: {
    loginAttempts: { success: number; failure: number };
    activeSessions: number;
  };
  systemHealth: {
    dbConnected: boolean;
    providers: Array<{
      provider: string;
      configured: boolean;
      reachable: boolean;
      latencyMs: number | null;
    }>;
    latestDeployAt: string | null;
  };
  errors: {
    last24h: number;
    topKinds: Array<{ kind: string; count: number }>;
  };
};

function now() {
  return new Date();
}

function subHours(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

function subDays(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function getProviderHealth(
  cookieHeader?: string,
): Promise<MonitoringMetrics["systemHealth"]["providers"]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT ?? 3000}`;
    const headers: Record<string, string> = {};
    if (cookieHeader) headers.cookie = cookieHeader;
    const res = await fetch(`${baseUrl}/api/ai/health`, {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      providers: Array<{
        provider: string;
        configured: boolean;
        reachable: boolean;
        latencyMs: number | null;
      }>;
    };
    return data.providers ?? [];
  } catch {
    return [];
  }
}

async function collectCaseMetrics(): Promise<MonitoringMetrics["cases"]> {
  const db = getDbClient();
  const last24h = subHours(24);
  const last7d = subDays(7);
  const last30d = subDays(30);
  const previous30dStart = subDays(60);
  const previous30dEnd = subDays(30);

  if (db) {
    const [
      totalRow,
      last24hRow,
      last7dRow,
      last30dRow,
      previousPeriodRow,
      statusRows,
    ] = await Promise.all([
      db.select({ value: count() }).from(cases).where(isNull(cases.deletedAt)),
      db
        .select({ value: count() })
        .from(cases)
        .where(and(isNull(cases.deletedAt), gte(cases.createdAt, last24h))),
      db
        .select({ value: count() })
        .from(cases)
        .where(and(isNull(cases.deletedAt), gte(cases.createdAt, last7d))),
      db
        .select({ value: count() })
        .from(cases)
        .where(and(isNull(cases.deletedAt), gte(cases.createdAt, last30d))),
      db
        .select({ value: count() })
        .from(cases)
        .where(
          and(
            isNull(cases.deletedAt),
            gte(cases.createdAt, previous30dStart),
            lte(cases.createdAt, previous30dEnd),
          ),
        ),
      db
        .select({ status: cases.status, value: count() })
        .from(cases)
        .where(isNull(cases.deletedAt))
        .groupBy(cases.status),
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of statusRows) {
      byStatus[row.status] = Number(row.value);
    }

    return {
      total: Number(totalRow[0]?.value ?? 0),
      last24h: Number(last24hRow[0]?.value ?? 0),
      last7d: Number(last7dRow[0]?.value ?? 0),
      last30d: Number(last30dRow[0]?.value ?? 0),
      byStatus,
      previousPeriodTotal: Number(previousPeriodRow[0]?.value ?? 0),
    };
  }

  return {
    total: 0,
    last24h: 0,
    last7d: 0,
    last30d: 0,
    byStatus: {},
    previousPeriodTotal: 0,
  };
}

async function collectAiUsageMetrics(): Promise<MonitoringMetrics["aiUsage"]> {
  const db = getDbClient();
  const last30d = subDays(30);

  const providerDefaults = ["gpt-4o", "claude", "gemini"];
  const byProvider: MonitoringMetrics["aiUsage"]["byProvider"] = {};
  for (const p of providerDefaults) {
    byProvider[p] = {
      calls: 0,
      successCount: 0,
      avgLatencyMs: null,
      fallbackCount: 0,
    };
  }

  if (db) {
    const [runRows, consultationRows] = await Promise.all([
      db
        .select({
          providerName: providerRuns.providerName,
          total: count(),
          success: count(sql`CASE WHEN ${providerRuns.status} = 'success' THEN 1 END`),
        })
        .from(providerRuns)
        .where(gte(providerRuns.createdAt, last30d))
        .groupBy(providerRuns.providerName),
      db
        .select({
          total: count(),
        })
        .from(aiConsultations)
        .where(gte(aiConsultations.createdAt, last30d)),
    ]);

    let totalCalls = Number(consultationRows[0]?.total ?? 0);
    for (const row of runRows) {
      const name = row.providerName;
      if (!byProvider[name]) {
        byProvider[name] = {
          calls: 0,
          successCount: 0,
          avgLatencyMs: null,
          fallbackCount: 0,
        };
      }
      byProvider[name].calls += Number(row.total);
      byProvider[name].successCount += Number(row.success);
      totalCalls += Number(row.total);
    }

    return {
      byProvider,
      totalCalls,
      totalFallbacks: 0,
    };
  }

  return {
    byProvider,
    totalCalls: 0,
    totalFallbacks: 0,
  };
}

async function collectAuthMetrics(): Promise<MonitoringMetrics["auth"]> {
  const db = getDbClient();

  if (db) {
    const [successAttempts, failureAttempts, activeSessions] = await Promise.all([
      db
        .select({ value: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventName, "login_success"),
            gte(analyticsEvents.createdAt, subHours(24)),
          ),
        ),
      db
        .select({ value: count() })
        .from(analyticsEvents)
        .where(
          and(
            eq(analyticsEvents.eventName, "login_failure"),
            gte(analyticsEvents.createdAt, subHours(24)),
          ),
        ),
      db
        .select({ value: count() })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.lastSeenAt, subHours(24))),
    ]);

    return {
      loginAttempts: {
        success: Number(successAttempts[0]?.value ?? 0),
        failure: Number(failureAttempts[0]?.value ?? 0),
      },
      activeSessions: Number(activeSessions[0]?.value ?? 0),
    };
  }

  return {
    loginAttempts: { success: 0, failure: 0 },
    activeSessions: 0,
  };
}

async function collectErrorMetrics(): Promise<MonitoringMetrics["errors"]> {
  const db = getDbClient();
  const last24h = subHours(24);

  if (db) {
    const [totalRow, kindRows] = await Promise.all([
      db
        .select({ value: count() })
        .from(auditLogs)
        .where(and(eq(auditLogs.action, "error"), gte(auditLogs.createdAt, last24h))),
      db
        .select({ kind: auditLogs.targetId, value: count() })
        .from(auditLogs)
        .where(and(eq(auditLogs.action, "error"), gte(auditLogs.createdAt, last24h)))
        .groupBy(auditLogs.targetId)
        .orderBy(desc(count()))
        .limit(5),
    ]);

    return {
      last24h: Number(totalRow[0]?.value ?? 0),
      topKinds: kindRows.map((row) => ({ kind: row.kind, count: Number(row.value) })),
    };
  }

  return {
    last24h: 0,
    topKinds: [],
  };
}

async function checkDbConnection(): Promise<boolean> {
  const db = getDbClient();
  if (!db) return false;
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
}

export async function getMonitoringMetrics(
  cookieHeader?: string,
): Promise<MonitoringMetrics> {
  const cache = globalThis.__ernMonitoringCache;
  if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const [casesMetrics, aiUsage, auth, errors, providers, dbConnected] =
    await Promise.all([
      collectCaseMetrics(),
      collectAiUsageMetrics(),
      collectAuthMetrics(),
      collectErrorMetrics(),
      getProviderHealth(cookieHeader),
      checkDbConnection(),
    ]);

  const metrics: MonitoringMetrics = {
    collectedAt: now().toISOString(),
    cases: casesMetrics,
    aiUsage,
    auth,
    systemHealth: {
      dbConnected,
      providers,
      latestDeployAt: process.env.VERCEL_DEPLOYMENT_ID
        ? now().toISOString()
        : null,
    },
    errors,
  };

  globalThis.__ernMonitoringCache = {
    timestamp: Date.now(),
    data: metrics,
  };

  return metrics;
}
