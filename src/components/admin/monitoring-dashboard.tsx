"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ContainerIcon,
  GlobalNetworkIcon,
  ShieldIcon,
  ShieldCheckIcon,
  WarningIcon,
} from "@/components/icons/trade-icons";
import type { MonitoringMetrics } from "@/lib/admin/monitoring";

const REFRESH_INTERVAL_MS = 30_000;

function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}

function formatDuration(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ja-JP", { hour12: false });
  } catch {
    return iso;
  }
}

function TrendBadge({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  if (previous === 0) {
    return current > 0 ? (
      <span className="text-xs font-semibold text-emerald-600">↑ NEW</span>
    ) : null;
  }
  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);
  if (diff === 0) {
    return <span className="text-xs font-semibold text-slate-500">→ 0%</span>;
  }
  const isPositive = diff > 0;
  return (
    <span
      className={`text-xs font-semibold ${
        isPositive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {isPositive ? "↑" : "↓"} {Math.abs(pct)}%
    </span>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        ok ? "bg-emerald-500" : "bg-red-500"
      }`}
    />
  );
}

function Card({
  title,
  children,
  action,
  icon,
  iconClassName = "bg-blue-50 text-brand-navy",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
              {icon}
            </div>
          ) : null}
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function MetricItem({
  label,
  value,
  trend,
  subtext,
}: {
  label: string;
  value: string;
  trend?: React.ReactNode;
  subtext?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {trend ? trend : null}
      </div>
      {subtext ? <p className="mt-1 text-xs text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export function MonitoringDashboard() {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "forbidden" }
    | { kind: "error" }
    | { kind: "success"; data: MonitoringMetrics }
  >({ kind: "loading" });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMetrics = useCallback(async ({ showSpinner = true } = {}) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/monitoring", { cache: "no-store" });
      if (res.status === 403) {
        setState({ kind: "forbidden" });
        return;
      }
      if (!res.ok) {
        setState({ kind: "error" });
        return;
      }
      const data = (await res.json()) as MonitoringMetrics;
      setState({ kind: "success", data });
      setLastRefreshed(new Date());
    } catch {
      setState({ kind: "error" });
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // 初回マウント時のデータ取得はeffectで行う必要がある
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      fetchMetrics({ showSpinner: false });
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoRefresh, fetchMetrics]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;
    let startX = 0;

    function onTouchStart(e: TouchEvent) {
      startY = e.touches[0]?.clientY ?? 0;
      startX = e.touches[0]?.clientX ?? 0;
    }

    function onTouchEnd(e: TouchEvent) {
      const endY = e.changedTouches[0]?.clientY ?? 0;
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const dy = endY - startY;
      const dx = endX - startX;
      if (
        dy > 80 &&
        Math.abs(dy) > Math.abs(dx) &&
        window.scrollY <= 0
      ) {
        fetchMetrics();
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [fetchMetrics]);

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchMetrics()}
            disabled={isRefreshing}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition disabled:opacity-60"
          >
            {isRefreshing ? <Spinner className="h-4 w-4" /> : null}
            更新
          </button>
          {lastRefreshed ? (
            <p className="text-sm text-slate-500">
              最終更新: {formatDuration(lastRefreshed.toISOString())}
            </p>
          ) : null}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
          />
          30秒自動更新
        </label>
      </div>

      {state.kind === "loading" || state.kind === "error" || state.kind === "forbidden" ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          {state.kind === "loading" ? (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Spinner className="h-4 w-4" />
              モニタリングデータを読み込んでいます…
            </div>
          ) : state.kind === "forbidden" ? (
            <EmptyState
              title="アクセス権限がありません"
              description="この画面は管理者のみ確認できます。"
            />
          ) : (
            <EmptyState
              title="データを取得できませんでした"
              description="更新ボタンで再試行してください。"
            />
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Cases */}
          <Card
            title="案件統計"
            icon={<ContainerIcon aria-hidden="true" className="h-5 w-5" />}
            iconClassName="bg-blue-50 text-brand-navy"
          >
            <div className="grid gap-3">
              <MetricItem
                label="総案件数"
                value={formatNumber(state.data.cases.total)}
                trend={
                  <TrendBadge
                    current={state.data.cases.last30d}
                    previous={state.data.cases.previousPeriodTotal}
                  />
                }
                subtext="前30日比"
              />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "24h", value: state.data.cases.last24h },
                  { label: "7d", value: state.data.cases.last7d },
                  { label: "30d", value: state.data.cases.last30d },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-center"
                  >
                    <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{formatNumber(item.value)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {Object.entries(state.data.cases.byStatus).map(([status, value]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <span className="text-sm text-slate-700">{status}</span>
                    <span className="text-sm font-bold text-slate-900">{formatNumber(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Usage */}
          <Card
            title="AI利用状況"
            action={<span className="text-xs text-slate-500">30日間</span>}
            icon={<GlobalNetworkIcon aria-hidden="true" className="h-5 w-5" />}
            iconClassName="bg-violet-50 text-violet-600"
          >
            <div className="space-y-3">
              {Object.entries(state.data.aiUsage.byProvider).map(([provider, stats]) => (
                <div
                  key={provider}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{provider.toUpperCase()}</span>
                    <span className="text-sm font-bold text-slate-900">{formatNumber(stats.calls)} 回</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>成功 {formatNumber(stats.successCount)}</span>
                    <span>·</span>
                    <span>成功率 {stats.calls > 0 ? Math.round((stats.successCount / stats.calls) * 100) : 0}%</span>
                    <span>·</span>
                    <span>平均 {stats.avgLatencyMs ?? "—"}ms</span>
                    {stats.fallbackCount > 0 ? (
                      <>
                        <span>·</span>
                        <span className="text-amber-600">フォールバック {formatNumber(stats.fallbackCount)}</span>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="text-sm font-semibold text-slate-700">合計呼び出し</span>
                <span className="text-sm font-bold text-slate-900">{formatNumber(state.data.aiUsage.totalCalls)}</span>
              </div>
              {state.data.aiUsage.totalFallbacks > 0 ? (
                <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <span className="text-sm font-semibold text-amber-800">フォールバック合計</span>
                  <span className="text-sm font-bold text-amber-900">{formatNumber(state.data.aiUsage.totalFallbacks)}</span>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Auth */}
          <Card
            title="ユーザーアクティビティ"
            action={<span className="text-xs text-slate-500">24h</span>}
            icon={<ShieldIcon aria-hidden="true" className="h-5 w-5" />}
            iconClassName="bg-emerald-50 text-emerald-600"
          >
            <div className="grid gap-3">
              <MetricItem
                label="ログイン成功"
                value={formatNumber(state.data.auth.loginAttempts.success)}
              />
              <MetricItem
                label="ログイン失敗"
                value={formatNumber(state.data.auth.loginAttempts.failure)}
              />
              <MetricItem
                label="アクティブセッション"
                value={formatNumber(state.data.auth.activeSessions)}
              />
            </div>
          </Card>

          {/* System Health */}
          <Card
            title="システムヘルス"
            icon={<ShieldCheckIcon aria-hidden="true" className="h-5 w-5" />}
            iconClassName="bg-sky-50 text-sky-600"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="text-sm font-semibold text-slate-700">DB接続</span>
                <div className="flex items-center gap-2">
                  <StatusDot ok={state.data.systemHealth.dbConnected} />
                  <span className="text-sm font-bold text-slate-900">
                    {state.data.systemHealth.dbConnected ? "正常" : "異常"}
                  </span>
                </div>
              </div>
              {state.data.systemHealth.providers.map((provider) => (
                <div
                  key={provider.provider}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-semibold text-slate-700">{provider.provider.toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <StatusDot ok={provider.reachable} />
                    <span className="text-sm text-slate-900">
                      {provider.configured
                        ? provider.reachable
                          ? `${provider.latencyMs ?? "—"}ms`
                          : "不通"
                        : "未設定"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-xs font-semibold text-slate-500">最新デプロイ</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {formatDuration(state.data.systemHealth.latestDeployAt)}
                </p>
              </div>
            </div>
          </Card>

          {/* Errors */}
          <Card
            title="エラー監視"
            action={<span className="text-xs text-slate-500">24h</span>}
            icon={<WarningIcon aria-hidden="true" className="h-5 w-5" />}
            iconClassName="bg-rose-50 text-rose-600"
          >
            <div className="grid gap-3">
              <MetricItem
                label="エラー数"
                value={formatNumber(state.data.errors.last24h)}
              />
              {state.data.errors.topKinds.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">トップ5</p>
                  {state.data.errors.topKinds.map((item) => (
                    <div
                      key={item.kind}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <span className="text-sm text-slate-700">{item.kind}</span>
                      <span className="text-sm font-bold text-slate-900">{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">直近24hのエラーはありません。</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
