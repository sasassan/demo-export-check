"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { ANALYTICS_SESSION_KEY, ANALYTICS_VISITOR_KEY, buildAnalyticsPayload } from "@/lib/analytics";
import { createId } from "@/lib/utils";

function getOrCreateStorageValue(key: string, prefix: string) {
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = createId(prefix);
  window.localStorage.setItem(key, created);
  return created;
}

function sendPayload(payload: unknown) {
  const body = JSON.stringify(payload);
  const url = "/api/analytics/collect";

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!pathname) return;

    const visitorId = getOrCreateStorageValue(ANALYTICS_VISITOR_KEY, "visitor");
    const sessionId = getOrCreateStorageValue(ANALYTICS_SESSION_KEY, "session");
    const search = searchParams.toString();
    const currentPath = `${window.location.pathname}${search ? `?${search}` : ""}`;

    const payload = buildAnalyticsPayload({
      sessionId,
      visitorId,
      path: currentPath,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      previousPath: previousPathRef.current,
    });

    sendPayload(payload);
    previousPathRef.current = currentPath;
  }, [pathname, searchParams]);

  return null;
}