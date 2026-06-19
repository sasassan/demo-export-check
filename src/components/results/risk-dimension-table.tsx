import type { DimensionScore } from "@/lib/types";
import type { Grade } from "@/lib/types";

const gradeBadge: Record<Grade, string> = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-amber-50 text-amber-700 border-amber-200",
  C: "bg-rose-50 text-rose-700 border-rose-200",
};

export function RiskDimensionTable({ items }: { items: DimensionScore[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">評価軸ごとの詳細</h2>
        <p className="mt-0.5 text-xs text-slate-500">各リスク項目の評価理由と推奨アクションを確認できます。</p>
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.dimension} className="grid gap-2 px-5 py-4 md:grid-cols-[180px_1fr_1fr]">
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-bold ${gradeBadge[item.grade]}`}>
                {item.grade}
              </span>
              <span className="text-sm font-medium text-slate-900">{item.label}</span>
            </div>
            <p className="text-sm text-slate-700">{item.rationale}</p>
            <p className="text-sm text-slate-500">{item.recommendedAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
