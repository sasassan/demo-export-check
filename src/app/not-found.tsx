import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50/60 via-white to-slate-50 px-6">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-brand-navy">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m-3-3h6" />
          </svg>
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-blue-600">Error 404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">ページが見つかりません</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          お探しのページは移動したか、公開版ではご利用いただけない可能性があります。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy-light"
          >
            トップへ戻る
          </Link>
          <Link
            href="/demo"
            className="inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-navy hover:text-brand-navy"
          >
            デモを見る
          </Link>
        </div>
      </div>
    </div>
  );
}