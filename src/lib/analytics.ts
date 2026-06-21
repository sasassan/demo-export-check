import type {
  AnalyticsCollectInput,
  AnalyticsDeviceType,
  AnalyticsEventRecord,
  AnalyticsSessionRecord,
} from "@/lib/types";
import { createId } from "@/lib/utils";

export const ANALYTICS_VISITOR_KEY = "ern_visitor_id";
export const ANALYTICS_SESSION_KEY = "ern_session_id";

export function normalizePath(value: string): string {
  try {
    const url = new URL(value, "https://example.invalid");
    return `${url.pathname}${url.search}`;
  } catch {
    return value || "/";
  }
}

export function detectDeviceType(userAgent: string): AnalyticsDeviceType {
  const lower = userAgent.toLowerCase();
  if (!lower) return "unknown";
  if (/(ipad|tablet)/.test(lower)) return "tablet";
  if (/(mobi|iphone|android)/.test(lower)) return "mobile";
  return "desktop";
}

export function buildAnalyticsPayload(input: {
  sessionId: string;
  visitorId: string;
  path: string;
  referrer?: string;
  userAgent: string;
  previousPath?: string;
  label?: string;
}): AnalyticsCollectInput {
  const now = new Date().toISOString();
  const normalizedPath = normalizePath(input.path);
  const normalizedReferrer = input.referrer ? normalizePath(input.referrer) : undefined;
  const url = new URL(input.path, "https://example.invalid");

  const session: AnalyticsSessionRecord = {
    id: input.sessionId,
    visitorId: input.visitorId,
    entryPath: normalizedPath,
    exitPath: normalizedPath,
    referrer: normalizedReferrer,
    utmSource: url.searchParams.get("utm_source") ?? undefined,
    utmMedium: url.searchParams.get("utm_medium") ?? undefined,
    utmCampaign: url.searchParams.get("utm_campaign") ?? undefined,
    deviceType: detectDeviceType(input.userAgent),
    startedAt: now,
    lastSeenAt: now,
  };

  const event: AnalyticsEventRecord = {
    id: createId("evt"),
    sessionId: input.sessionId,
    visitorId: input.visitorId,
    eventName: "page_view",
    path: normalizedPath,
    fromPath: input.previousPath ? normalizePath(input.previousPath) : undefined,
    toPath: normalizedPath,
    label: input.label,
    createdAt: now,
  };

  return { session, event };
}