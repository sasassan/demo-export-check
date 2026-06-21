"use client";

import { useEffect } from "react";

import {
  ANALYTICS_SESSION_KEY,
  ANALYTICS_VISITOR_KEY,
  buildAnalyticsClickPayload,
} from "@/lib/analytics";
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

export function CtaClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest<HTMLElement>("[data-cta-id]");
      if (!element) return;

      const ctaId = element.dataset.ctaId;
      const ctaLabel = element.dataset.ctaLabel ?? element.textContent?.trim() ?? "unknown";
      const ctaTarget = element.dataset.ctaTarget;

      if (!ctaId) return;

      const visitorId = getOrCreateStorageValue(ANALYTICS_VISITOR_KEY, "visitor");
      const sessionId = getOrCreateStorageValue(ANALYTICS_SESSION_KEY, "session");
      const currentPath = `${window.location.pathname}${window.location.search}`;

      const payload = buildAnalyticsClickPayload({
        sessionId,
        visitorId,
        path: currentPath,
        targetPath: ctaTarget,
        userAgent: navigator.userAgent,
        label: ctaLabel,
        ctaId,
      });

      sendPayload(payload);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}