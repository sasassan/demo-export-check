"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

type PreflightSeverity = "blocking" | "warning" | "info";

type PreflightFinding = {
  key: string;
  category: string;
  severity: PreflightSeverity;
  issueType: string;
  issue: string;
  remediation: string;
};

type PreflightReport = {
  checkedAt: string;
  environment: string;
  isProduction: boolean;
  findings: PreflightFinding[];
  hasBlockingIssues: boolean;
};

type FetchState =
  | { kind: "loading" }
  | { kind: "forbidden" }
  | { kind: "error" }
  | { kind: "success"; data: PreflightReport };

const SEVERITY_LABELS: Record<PreflightSeverity, string> = {
  blocking: "本番投入ブロック",
  warning: "警告",
  info: "情報",
};

const SEVERITY_STYLES: Record<PreflightSeverity, string> = {
  blocking: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-slate-200 bg-slate-100 text-slate-600",
};

function formatCheckedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ja-JP", { hour12: false });
  } catch {
    return iso;
  }
}

function FindingCard({ finding }: { finding: PreflightFinding }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-sm font-semibold text-slate-900">{finding.key}</p>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${SEVERITY_STYLES[finding.severity]}`}
        >
          {SEVERITY_LABELS[finding.severity]}
        </span>
      </div>
      <p className="mt-2 text-xs leading-6 text-slate-700">{finding.issue}</p>
      <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
        <p className="text-[11px] font-semibold text-slate-500">対処方針</p>
        <p className="mt-1 text-xs leading-6 text-slate-700">{finding.remediation}</p>
      </div>
    </div>
  );
}

export function ConfigPreflightPanel() {
  const [state, setState] = useState<FetchState>({ kind: "loading" });
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/config/preflight", { cache: "no-store" })
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
        const data = (await res.json()) as PreflightReport;
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
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">設定プリフライトチェック</p>
            <p className="mt-1 text-xs text-slate-500">
              本番投入前に安全でない設定（プレースホルダー値・弱いシークレット等）が残っていないかを確認します。値そのものは表示しません。
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={state.kind === "loading"}
            className="trade-hover-lift inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.kind === "loading" && refreshToken > 0 ? <Spinner className="h-3.5 w-3.5" /> : null}
            再確認
          </button>
        </div>

        <div className="mt-5">
          {state.kind === "loading" ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
              <Spinner className="h-4 w-4" />
              設定を確認しています…
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    実行環境: {state.data.environment}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    検出項目 {state.data.findings.length}件
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    最終確認: {formatCheckedAt(state.data.checkedAt)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${
                    state.data.hasBlockingIssues
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {state.data.hasBlockingIssues ? "本番投入ブロック項目あり" : "ブロック項目なし"}
                </span>
              </div>

              {state.data.findings.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                  検出された問題はありません。
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {state.data.findings.map((finding) => (
                    <FindingCard key={`${finding.key}-${finding.issueType}`} finding={finding} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
