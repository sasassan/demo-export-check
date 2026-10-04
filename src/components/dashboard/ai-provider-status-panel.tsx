"use client";

import type { ProviderRuntimeInfo } from "@/lib/ai/config";

type Props = {
  providers: ProviderRuntimeInfo[];
};

const statusColorMap: Record<string, string> = {
  live: "text-emerald-400 bg-tint-emerald border-tint-emerald-border",
  "fallback-no-key": "text-amber-400 bg-tint-amber border-tint-amber-border",
  "fallback-disabled": "text-slate-700 bg-slate-100 border-slate-200",
  "fallback-error": "text-red-400 bg-tint-red border-tint-red-border",
};

const dotColorMap: Record<string, string> = {
  live: "bg-tint-emerald0",
  "fallback-no-key": "bg-amber-400",
  "fallback-disabled": "bg-slate-400",
  "fallback-error": "bg-tint-red0",
};

export function AiProviderStatusPanel({ providers }: Props) {
  const liveCount = providers.filter((provider) => provider.status === "live").length;

  return (
    <div className="rounded-xl border border-slate-200 bg-panel p-3 shadow-sm sm:p-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">現在のAI構成</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              実AI接続 {liveCount} / {providers.length}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              ダッシュボード上で、どのAIが実APIで動作し、どれがフォールバック中か確認できます。
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-panel px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">有効化の切り替え</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              ENABLED_AI_PROVIDERS
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.providerName}
              className="rounded-lg border border-slate-200 bg-panel px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{provider.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{provider.providerName}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusColorMap[provider.status]}`}
                >
                  {provider.statusLabel}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>有効状態</span>
                  <span className="font-semibold text-slate-900">
                    {provider.enabled ? "有効" : "無効"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>タイムアウト</span>
                  <span className="font-semibold text-slate-900">
                    {provider.timeoutMs}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>APIキー</span>
                  <span className="font-semibold text-slate-900">
                    {provider.apiKey ? "設定済み" : "未設定"}
                  </span>
                </div>
              </div>

              {provider.reason && (
                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-[11px] leading-5 text-slate-500">{provider.reason}</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${dotColorMap[provider.status]}`}
                />
                <span className="text-[11px] text-slate-500">
                  {provider.status === "live"
                    ? "本番APIで診断します"
                    : "診断時はフォールバックロジックを使用します"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          {[
            { label: "実API", color: "bg-tint-emerald0" },
            { label: "APIキー未設定", color: "bg-amber-400" },
            { label: "無効", color: "bg-slate-400" },
            { label: "エラー時フォールバック", color: "bg-tint-red0" },
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
      </div>
    </div>
  );
}