import Link from "next/link";

import type { CaseDetail } from "@/lib/types";
import type { Grade } from "@/lib/types";

const gradeLabel: Record<Grade, string> = {
  A: "問題なし",
  B: "要確認",
  C: "高リスク",
};

const gradeBadge: Record<Grade, string> = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-amber-50 text-amber-700 border-amber-200",
  C: "bg-rose-50 text-rose-700 border-rose-200",
};

export function ReportPreview({ detail }: { detail: CaseDetail }) {
  if (!detail.assessment) {
    return null;
  }

  const overall = detail.assessment.summary.overall;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-[#1e3a5f]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">PDFレポート出力</h2>
            <p className="text-xs text-slate-500">上司提出・社内決裁向けに即時生成</p>
          </div>
        </div>
        <Link
          href={`/api/reports/${detail.case.id}/pdf`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-[#2a4a73] sm:w-auto"
          target="_blank"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          PDFをダウンロード
        </Link>
      </div>
      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm text-slate-500">調査要約</p>
          <p className="mt-1 text-sm leading-7 text-slate-700">{detail.assessment.summary.summary}</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">{detail.assessment.reportNarrative}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-blue-50 px-4 py-4 text-center sm:px-6">
          <p className="text-xs font-semibold text-slate-500">総合評価</p>
          <p className={`mt-1 text-4xl font-bold sm:text-5xl ${gradeBadge[overall].split(" ")[1]}`}>{overall}</p>
          <span className={`mt-1 rounded-full border px-2 py-0.5 text-xs font-medium ${gradeBadge[overall]}`}>
            {gradeLabel[overall]}
          </span>
        </div>
      </div>
    </div>
  );
}
