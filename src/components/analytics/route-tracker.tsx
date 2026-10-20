"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { ANALYTICS_SESSION_KEY, ANALYTICS_VISITOR_KEY, buildAnalyticsPayload, buildAnalyticsTimeSpentPayload } from "@/lib/analytics";
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
  const currentPathRef = useRef<string | undefined>(undefined);
  const entryTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!pathname) return;

    const visitorId = getOrCreateStorageValue(ANALYTICS_VISITOR_KEY, "visitor");
    const sessionId = getOrCreateStorageValue(ANALYTICS_SESSION_KEY, "session");
    const search = searchParams.toString();
    const currentPath = `${window.location.pathname}${search ? `?${search}` : ""}`;

    const previousPath = previousPathRef.current;

    // 前のページに滞在していた時間を先に送信してから、新しいページビューを記録する。
    if (previousPath && entryTimeRef.current > 0) {
      const durationMs = Math.max(0, Date.now() - entryTimeRef.current);
      sendPayload(
        buildAnalyticsTimeSpentPayload({
          sessionId,
          visitorId,
          path: previousPath,
          durationMs,
          userAgent: navigator.userAgent,
        }),
      );
    }

    const payload = buildAnalyticsPayload({
      sessionId,
      visitorId,
      path: currentPath,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      previousPath,
    });

    sendPayload(payload);
    previousPathRef.current = currentPath;
    currentPathRef.current = currentPath;
    entryTimeRef.current = Date.now();
  }, [pathname, searchParams]);

  // タブを閉じる・離脱する際に、表示中ページの滞在時間を送信する。
  useEffect(() => {
    function flushDwellTime() {
      const currentPath = currentPathRef.current;
      if (!currentPath || entryTimeRef.current <= 0) return;

      const visitorId = getOrCreateStorageValue(ANALYTICS_VISITOR_KEY, "visitor");
      const sessionId = getOrCreateStorageValue(ANALYTICS_SESSION_KEY, "session");
      const durationMs = Math.max(0, Date.now() - entryTimeRef.current);

      sendPayload(
        buildAnalyticsTimeSpentPayload({
          sessionId,
          visitorId,
          path: currentPath,
          durationMs,
          userAgent: navigator.userAgent,
        }),
      );

      // 二重送信を防ぐため、送信済みの滞在計測をリセットする。
      entryTimeRef.current = 0;
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flushDwellTime();
      } else if (currentPathRef.current) {
        // タブが再表示されたら、同じページの新しい滞在計測を開始する。
        entryTimeRef.current = Date.now();
      }
    }

    window.addEventListener("pagehide", flushDwellTime);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", flushDwellTime);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}