import Link from "next/link";

import { LostCargoShipIllustration } from "@/components/icons/trade-illustrations";

export default function NotFound() {
  return (
    <div id="main-content" tabIndex={-1} className="flex min-h-screen items-center justify-center bg-gradient-to-b from-tint-blue/60 via-panel to-slate-50 px-6 outline-none">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-panel p-10 text-center shadow-xl shadow-slate-900/5">
        <LostCargoShipIllustration
          aria-hidden="true"
          className="mx-auto h-28 w-full max-w-xs text-brand-navy/70"
        />
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-400">
          Error 404 · PORT NOT FOUND
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">ページが見つかりません</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          お探しのページは移動したか、公開版ではご利用いただけない可能性があります。
          目的の港（ページ）が見つかりませんでした。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-brand-deep px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-deep-light"
          >
            トップへ戻る
          </Link>
          <Link
            href="/demo"
            className="inline-flex rounded-xl border border-slate-300 bg-panel px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:text-brand-navy"
          >
            デモを見る
          </Link>
        </div>
      </div>
    </div>
  );
}