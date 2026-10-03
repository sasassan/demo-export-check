"use client";

import type { DimensionScore } from "@/lib/types";

type Props = {
  dimensions: DimensionScore[];
};

const COLORS = [
  "bg-rose-500",
  "bg-orange-400",
  "bg-amber-400",
  "bg-yellow-300",
  "bg-lime-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
];

export function RiskHeatmap({ dimensions }: Props) {
  if (!dimensions || dimensions.length === 0) return null;

  const total = dimensions.reduce((s, d) => s + d.score, 0);

  const sorted = [...dimensions].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">リスクヒートマップ</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          リスクスコアの分布（面積=リスクの大きさ）
        </p>
      </div>

      {/* 面積グラフ（横積み）。凡例が同じ数値をテキストで提供するため、視覚表現は支援技術から隠す */}
      <div aria-hidden="true" className="h-12 rounded-xl overflow-hidden flex">
        {sorted.map((d, idx) => {
          const pct = total > 0 ? (d.score / total) * 100 : 100 / sorted.length;
          return (
            <div
              key={d.dimension}
              className={`${COLORS[idx % COLORS.length]} transition-all relative group`}
              style={{ width: `${pct}%` }}
              title={`${d.label}: ${d.score}点 (${pct.toFixed(1)}%)`}
            >
              {pct > 8 && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold truncate px-1">
                  {d.label.slice(0, 3)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {sorted.map((d, idx) => {
          const pct = total > 0 ? (d.score / total) * 100 : 100 / sorted.length;
          return (
            <div key={d.dimension} className="flex items-center gap-1.5">
              <span
                className={`w-3 h-3 rounded-sm flex-shrink-0 ${COLORS[idx % COLORS.length]}`}
              />
              <span className="text-xs text-slate-600 truncate">{d.label}</span>
              <span className="text-xs text-slate-500 ml-auto">
                {pct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* リスク集中度コメント */}
      {sorted[0] && (
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          最大リスク: <span className="font-semibold text-slate-700">{sorted[0].label}</span>{" "}
          （全体の{((sorted[0].score / total) * 100).toFixed(0)}%）
        </p>
      )}
    </div>
  );
}
