"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

type ProviderKey = "gpt-4o" | "claude" | "gemini";

type ProviderHealth = {
  provider: ProviderKey;
  configured: boolean;
  model: string;
  reachable: boolean;
  latencyMs: number | null;
  error?: string;
  modelDeprecated: boolean;
  orgId: string | null;
  projectId: string | null;
  keyFingerprint: string | null;
  actualModelName: string | null;
};

type HealthResponse = {
  checkedAt: string;
  providers: ProviderHealth[];
};

type FetchState =
  | { kind: "loading" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "success"; data: HealthResponse };

const PROVIDER_LABELS: Record<ProviderKey, string> = {
  "gpt-4o": "GPT-4o (OpenAI)",
  claude: "Claude",
  gemini: "Gemini (Google)",
};

function shortenFingerprint(fingerprint: string | null): string {
  if (!fingerprint) return "未設定";
  return `${fingerprint.slice(0, 8)}…`;
}

function formatCheckedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ja-JP", { hour12: false });
  } catch {
    return iso;
  }
}

function StatusBadge({ provider }: { provider: ProviderHealth }) {
  if (!provider.configured) {
    return (
      <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
        未設定
      </span>
    );
  }
  if (provider.modelDeprecated) {
    return (
      <span className="rounded-full border border-tint-amber-border bg-tint-amber px-2.5 py-1 text-[11px] font-bold text-amber-400">
        モデル廃止の疑い
      </span>
    );
  }
  if (provider.reachable) {
    return (
      <span className="rounded-full border border-tint-emerald-border bg-tint-emerald px-2.5 py-1 text-[11px] font-bold text-emerald-400">
        稼働中
      </span>
    );
  }
  return (
    <span className="rounded-full border border-tint-red-border bg-tint-red px-2.5 py-1 text-[11px] font-bold text-red-400">
      疎通失敗
    </span>
  );
}

function StatusDot({ provider }: { provider: ProviderHealth }) {
  const color = !provider.configured
    ? "bg-slate-400"
    : provider.modelDeprecated
      ? "bg-amber-400"
      : provider.reachable
        ? "bg-emerald-400"
        : "bg-red-400";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

function ProviderCard({ provider }: { provider: ProviderHealth }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-panel px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{PROVIDER_LABELS[provider.provider]}</p>
          <p className="mt-0.5 text-xs text-slate-500">設定モデル: {provider.model}</p>
        </div>
        <StatusBadge provider={provider} />
      </div>

      <div className="mt-4 space-y-2 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span>実モデル名</span>
          <span className="font-semibold text-slate-900">
            {provider.actualModelName ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>キー指紋</span>
          <span className="font-mono font-semibold text-slate-900">
            {shortenFingerprint(provider.keyFingerprint)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>応答時間</span>
          <span className="font-semibold text-slate-900">
            {provider.latencyMs !== null ? `${provider.latencyMs}ms` : "—"}
          </span>
        </div>
        {provider.orgId ? (
          <div className="flex items-center justify-between">
            <span>Org ID</span>
            <span className="font-mono font-semibold text-slate-900">{provider.orgId}</span>
          </div>
        ) : null}
        {provider.projectId ? (
          <div className="flex items-center justify-between">
            <span>Project ID</span>
            <span className="font-mono font-semibold text-slate-900">{provider.projectId}</span>
          </div>
        ) : null}
      </div>

      {provider.modelDeprecated ? (
        <div className="mt-4 rounded-xl border border-tint-amber-border bg-tint-amber px-3 py-2">
          <p className="text-[11px] leading-5 text-amber-300">
            警告: 設定されたモデルがプロバイダー側で廃止（404 NOT_FOUND）されている可能性があります。
            モデル名の見直しが必要です。
          </p>
        </div>
      ) : provider.error ? (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] leading-5 text-slate-500">
            エラー分類: {provider.error}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <StatusDot provider={provider} />
        <span className="text-[11px] text-slate-500">
          {!provider.configured
            ? "APIキーが未設定のため疎通確認をスキップしました"
            : provider.modelDeprecated
              ? "モデル名の見直しが必要です"
              : provider.reachable
                ? "本番APIへの疎通に成功しました"
                : "本番APIへの疎通に失敗しました"}
        </span>
      </div>
    </div>
  );
}

function OverallSummary({ data }: { data: HealthResponse }) {
  const total = data.providers.length;
  const reachableCount = data.providers.filter((p) => p.reachable).length;
  const deprecatedCount = data.providers.filter((p) => p.modelDeprecated).length;

  let summaryLabel: string;
  let summaryColor: string;
  if (deprecatedCount > 0) {
    summaryLabel = "モデル廃止を検知";
    summaryColor = "text-amber-400 bg-tint-amber border-tint-amber-border";
  } else if (reachableCount === total) {
    summaryLabel = "全プロバイダー正常";
    summaryColor = "text-emerald-400 bg-tint-emerald border-tint-emerald-border";
  } else if (reachableCount === 0) {
    summaryLabel = "全プロバイダー障害";
    summaryColor = "text-red-400 bg-tint-red border-tint-red-border";
  } else {
    summaryLabel = "一部プロバイダーで障害";
    summaryColor = "text-red-400 bg-tint-red border-tint-red-border";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">全体ステータス</p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">
          疎通成功 {reachableCount} / {total}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          最終確認: {formatCheckedAt(data.checkedAt)}
        </p>
      </div>
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${summaryColor}`}
      >
        {summaryLabel}
      </span>
    </div>
  );
}

export function AiHealthPanel() {
  const [state, setState] = useState<FetchState>({ kind: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);
  const isRefreshing = refreshToken > 0 && state.kind === "loading";

  useEffect(() => {
    let cancelled = false;

    fetch("/api/ai/health", { cache: "no-store" })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 403) {
          setState({ kind: "forbidden" });
          return;
        }
        if (!res.ok) {
          setState({ kind: "error" });
          return;
        }
        const data = (await res.json()) as HealthResponse;
        if (!cancelled) setState({ kind: "success", data });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  const handleRefresh = () => {
    setState({ kind: "loading" });
    setRefreshToken((token) => token + 1);
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-panel p-3 shadow-sm sm:p-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">プロバイダー疎通診断</p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={state.kind === "loading"}
            className="trade-hover-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-panel px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? <Spinner className="h-3.5 w-3.5" /> : null}
            再確認
          </button>
        </div>

        <div className="mt-5">
          {state.kind === "loading" ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-panel px-6 py-10 text-sm text-slate-500">
              <Spinner className="h-4 w-4" />
              各プロバイダーへの疎通確認を実行しています…
            </div>
          ) : state.kind === "forbidden" ? (
            <EmptyState
              title="アクセス権限がありません"
              description="この診断結果は管理者のみ確認できます。管理者権限のあるアカウントで再度ログインしてください。"
            />
          ) : state.kind === "error" ? (
            <EmptyState
              title="診断結果を取得できませんでした"
              description="一時的な問題が発生している可能性があります。再確認ボタンで再試行してください。"
            />
          ) : (
            <>
              <OverallSummary data={state.data} />

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {state.data.providers.map((provider) => (
                  <ProviderCard key={provider.provider} provider={provider} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 lg:grid-cols-4">
                {[
                  { label: "稼働中", color: "bg-emerald-400" },
                  { label: "モデル廃止の疑い", color: "bg-amber-400" },
                  { label: "疎通失敗", color: "bg-red-400" },
                  { label: "未設定", color: "bg-slate-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-panel px-3 py-2"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
