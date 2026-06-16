import Link from "next/link";

import { DashboardCaseList } from "@/components/dashboard/dashboard-case-list";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { listCasesByUser } from "@/lib/db/repository";

export default async function DashboardPage() {
  const userEmail = await requireSessionEmail();
  const items = await listCasesByUser(userEmail);

  const completed = items.filter((i) => i.status === "completed").length;
  const investigating = items.filter((i) => i.status === "investigating").length;
  const needsReview = completed;

  return (
    <Shell
      title="案件一覧"
      description="案件の検索・絞り込み・状況把握をまとめて行えます。AIスクリーニングの進行状況や確認待ち案件も一目で把握できます。"
    >
      {/* ユーザー情報バー */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border border-indigo-200/50 bg-white/95 px-6 py-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{userEmail}</p>
            <p className="text-xs text-slate-500">
              {items.length} 件の案件 · 完了 {completed} 件
              {investigating > 0 ? ` · AI確認中 ${investigating} 件` : ""}
            </p>
          </div>
        </div>
        <Link
          href="/cases/new"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          新規案件を登録
        </Link>
      </div>

      {/* 統計カード */}
      <div className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <p className="text-sm font-medium text-slate-500">進行中の一次スクリーニング</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{investigating}</p>
            <p className="mt-2 text-sm text-slate-500">登録直後の案件は一次スクリーニングを開始します。</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <p className="text-sm font-medium text-slate-500">結果確認待ち</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{needsReview}</p>
            <p className="mt-2 text-sm text-slate-500">A/B/C評価と根拠ソースをそのまま確認できます。</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-600 p-5 text-white">
            <p className="text-sm font-medium text-indigo-100">今日のおすすめ</p>
            <p className="mt-3 text-lg font-semibold">先にAI診断で入力漏れを減らす</p>
            <p className="mt-2 text-sm text-indigo-100/90">
              新規案件ページでは、登録前に重要な不足情報を簡易チェックできます。
            </p>
          </div>
        </div>
      </div>

      {/* タスク・機能 */}
      <div className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-4">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <p className="text-sm font-medium text-slate-500">優先確認タスク</p>
            <div className="mt-4 space-y-3">
              {[
                "B評価案件は、用途確認書と最終需要先を優先確認",
                "高リスク国向け案件は、社内承認フローへ即時共有",
                "顧客英字表記の未確認案件は制裁再検索を実施",
              ].map((task) => (
                <div key={task} className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
            <p className="text-sm font-medium text-slate-500">活用できる機能</p>
            <div className="mt-4 grid gap-3">
              {[
                { title: "案件検索", text: "商品名・顧客名・輸出先国からすぐに案件を探せます。" },
                { title: "ステータス絞り込み", text: "スクリーニング中・完了案件だけを切り替えて確認できます。" },
                { title: "並び替え", text: "更新日や商品名順で一覧を整理できます。" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-indigo-100 bg-white px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 案件リスト */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white/95 px-6 py-16 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">案件がまだありません</h3>
          <p className="mt-1 text-sm text-slate-500">新規案件を登録して、輸出リスクの調査を始めましょう。</p>
          <Link
            href="/cases/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
          >
            最初の案件を登録する
          </Link>
        </div>
      ) : (
        <DashboardCaseList items={items} />
      )}
    </Shell>
  );
}
