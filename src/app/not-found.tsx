import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-3xl font-semibold">ページが見つかりません</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          案件が削除されたか、ログイン状態が切れている可能性があります。
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          案件一覧へ戻る
        </Link>
      </div>
    </div>
  );
}