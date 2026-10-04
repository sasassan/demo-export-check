import type { DimensionScore } from "@/lib/types";
import type { Grade } from "@/lib/types";

const gradeBadge: Record<Grade, string> = {
  A: "bg-tint-emerald text-emerald-400 border-tint-emerald-border",
  B: "bg-tint-amber text-amber-400 border-tint-amber-border",
  C: "bg-tint-rose text-rose-400 border-tint-rose-border",
};

const gradeBar: Record<Grade, string> = {
  A: "bg-tint-emerald0",
  B: "bg-amber-400",
  C: "bg-tint-rose0",
};

export function RiskDimensionTable({ items }: { items: DimensionScore[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-panel shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">評価軸ごとの詳細</h2>
        <p className="mt-0.5 text-sm text-slate-500">各リスク項目の評価理由と推奨アクションを確認できます。</p>
      </div>
      <div className="divide-y divide-slate-200">
        {items.map((item) => (
          <div key={item.dimension} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[200px_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-bold ${gradeBadge[item.grade]}`}>
                  {item.grade}
                </span>
                <span className="text-sm font-medium text-slate-900">{item.label}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${gradeBar[item.grade]}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-600">{item.score}点</span>
              </div>
            </div>
            <p className="text-sm text-slate-700">{item.rationale}</p>
            <p className="text-sm text-slate-500">{item.recommendedAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
