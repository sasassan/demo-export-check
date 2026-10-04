"use client";

import Link from "next/link";

import { LostCargoShipIllustration } from "@/components/icons/trade-illustrations";

export function ErrorFallback({
  title = "エラーが発生しました",
  message = "表示中に問題が発生しました。通信状況を確認して、もう一度お試しください。",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-tint-blue/60 via-panel to-slate-50 px-6">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-panel p-10 text-center shadow-xl shadow-slate-900/5">
        <LostCargoShipIllustration
          aria-hidden="true"
          className="mx-auto h-28 w-full max-w-xs text-brand-navy/70"
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-400">
          Something went wrong · SIGNAL LOST
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">{message}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="trade-primary-button"
            >
              再試行する
            </button>
          ) : null}
          <Link
            href="/"
            className="inline-flex rounded-xl border border-slate-300 bg-panel px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:text-brand-navy"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
