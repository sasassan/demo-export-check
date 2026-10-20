import Link from "next/link";

import { formatDate } from "@/lib/utils";
import { pickTransportIcon } from "@/components/icons/trade-icons";
import type { CaseRecord } from "@/lib/types";

const statusConfig = {
  draft: {
    label: "下書き",
    cls: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  investigating: {
    label: "AI確認中",
    cls: "bg-tint-blue text-blue-300",
    dot: "bg-blue-600 animate-pulse",
  },
  completed: {
    label: "調査完了",
    cls: "bg-tint-emerald text-emerald-400",
    dot: "bg-emerald-400",
  },
  failed: {
    label: "エラー",
    cls: "bg-tint-rose text-rose-400",
    dot: "bg-rose-400",
  },
} as const;

export function CaseSummaryCard({ item }: { item: CaseRecord }) {
  const status = statusConfig[item.status];
  const transportIcon = pickTransportIcon(item.id)({ "aria-hidden": true, className: "h-6 w-6" });
  const quickHint =
    item.status === "completed"
      ? "AI評価と根拠を確認できます"
      : item.status === "investigating"
        ? "AIが一次スクリーニングを進行中です"
        : item.status === "failed"
          ? "入力内容または調査条件を見直してください"
          : "案件情報を追加入力できます";

  return (
    <Link
      href={`/cases/${item.id}`}
      className="trade-hover-lift flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-panel/95 px-6 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-brand-navy/30"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tint-blue text-brand-navy ring-1 ring-brand-navy/10 sm:flex">
          {transportIcon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <p className="truncate text-base font-semibold text-slate-900">{item.productName}</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.cls}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>型番: {item.modelNumber}</span>
            <span className="hidden sm:inline">·</span>
            <span>顧客: {item.customerCompanyName}</span>
            <span className="hidden sm:inline">·</span>
            <span>輸出先: {item.destinationCountry}</span>
          </div>
          <p className="mt-2 text-sm text-brand-navy/70">{quickHint}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
        <span className="hidden md:block">{formatDate(item.updatedAt)}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-500">
          <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
}
