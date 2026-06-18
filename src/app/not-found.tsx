import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-3xl font-semibold">ページが見つかりません</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          お探しのページは移動したか、公開版ではご利用いただけない可能性があります。
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            トップへ戻る
          </Link>
          <Link
            href="/demo"
            className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            デモを見る
          </Link>
        </div>
      </div>
    </div>
  );
}