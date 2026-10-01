import Link from "next/link";

import { DashboardCaseList } from "@/components/dashboard/dashboard-case-list";
import { Shell } from "@/components/layout/shell";
import { ContainerIcon } from "@/components/icons/trade-icons";
import { CustomsDocumentIllustration, PortSilhouetteStrip } from "@/components/icons/trade-illustrations";
import { requireSessionEmail } from "@/lib/auth/server";
import { listCasesByUser } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default async function CasesPage() {
  const userEmail = await requireSessionEmail();
  const items = await listCasesByUser(userEmail);

  const completed = items.filter((i) => i.status === "completed").length;
  const investigating = items.filter((i) => i.status === "investigating").length;
  const needsReview = completed;

  return (
    <Shell
      title="案件一覧"
      description="登録済みの輸出リスク調査案件を検索・絞り込み・確認できます。"
    >
      <div className="relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center">
        <PortSilhouetteStrip
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-brand-navy/[0.06]"
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-brand-navy">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{userEmail}</p>
            <p className="text-sm text-slate-500">
              {items.length} 件の案件 · 完了 {completed} 件
              {investigating > 0 ? ` · AI確認中 ${investigating} 件` : ""}
            </p>
          </div>
        </div>
        <Link
          href="/cases/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light sm:w-auto sm:py-2"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          新規案件を登録
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            進行中の一次スクリーニング
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{investigating}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-emerald-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            結果確認待ち
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{needsReview}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <ContainerIcon className="h-4 w-4 text-brand-navy" />
            全案件数
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">{items.length}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <CustomsDocumentIllustration aria-hidden="true" className="h-9 w-9 text-brand-navy" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900">案件がまだありません</h3>
          <p className="mt-1 text-sm text-slate-500">新規案件を登録して、輸出リスクの調査を始めましょう。</p>
          <Link
            href="/cases/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light"
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
