"use client";

import type { DimensionScore, ScoreSummary } from "@/lib/types";
import type { RiskDimension } from "@/lib/constants";

type Props = {
  dimensions: DimensionScore[];
  summary: ScoreSummary;
};

const gradeBarColor: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-amber-400",
  C: "bg-red-500",
};

const gradeBg: Record<string, string> = {
  A: "text-emerald-700 bg-emerald-50",
  B: "text-amber-700 bg-amber-50",
  C: "text-red-700 bg-red-50",
};

const CATEGORIES: { label: string; dimensions: RiskDimension[] }[] = [
  {
    label: "輸出規制リスク",
    dimensions: ["sanctions", "catchAll", "useCase"],
  },
  {
    label: "企業信用リスク",
    dimensions: ["endUser", "ubo", "peps", "reputation"],
  },
  {
    label: "国リスク",
    dimensions: ["country"],
  },
];

export function RiskMeter({ dimensions }: Props) {
  const dimMap = new Map(dimensions.map((d) => [d.dimension, d]));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">リスクメーター</h3>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const catDims = cat.dimensions
            .map((k) => dimMap.get(k))
            .filter((d): d is DimensionScore => d !== undefined);

          if (catDims.length === 0) return null;

          const avgScore =
            catDims.reduce((s, d) => s + d.score, 0) / catDims.length;
          const maxGrade = catDims.reduce(
            (worst, d) => {
              const order = { A: 0, B: 1, C: 2 };
              return order[d.grade] > order[worst] ? d.grade : worst;
            },
            "A" as "A" | "B" | "C",
          );

          return (
            <div key={cat.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  {cat.label}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeBg[maxGrade]}`}
                >
                  {maxGrade}
                </span>
              </div>

              {/* 個別次元バー */}
              <div className="space-y-1.5">
                {catDims.map((d) => (
                  <div key={d.dimension}>
                    <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                      <span>{d.label}</span>
                      <span>{d.score}点</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${gradeBarColor[d.grade]}`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* カテゴリ平均 */}
              <p className="text-xs text-gray-500 mt-1.5">
                カテゴリ平均スコア: {Math.round(avgScore)}点
              </p>
            </div>
          );
        })}
      </div>

      {/* スコア凡例 */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          A（0〜39: 問題なし）
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          B（40〜69: 要確認）
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          C（70〜: 高リスク）
        </span>
      </div>
    </div>
  );
}
