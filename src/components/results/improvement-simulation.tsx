"use client";

import type { ImprovementStep } from "@/lib/types";

type Props = {
  steps: ImprovementStep[];
  baseScore: number;
};

export function ImprovementSimulation({ steps, baseScore }: Props) {
  if (!steps || steps.length === 0) return null;

  const maxScore = steps[steps.length - 1]?.cumulativeScore ?? baseScore;

  return (
    <div className="bg-panel border border-slate-200 rounded-2xl shadow-sm p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900">改善シミュレーション</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          各アクションを実施することでスコアがどう変わるか
        </p>
      </div>

      {/* スコアラダー */}
      <div className="space-y-3">
        {/* 現在地 */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-right">
            <span className="text-lg font-black text-slate-700">{baseScore}</span>
            <span className="text-xs text-slate-500">点</span>
          </div>
          <div className="flex-1 relative h-10 flex items-center">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 rounded-full"
                style={{ width: `${baseScore}%` }}
              />
            </div>
          </div>
          <div className="w-24">
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              現在のスコア
            </span>
          </div>
        </div>

        {steps.map((step, idx) => {
          const pct = step.cumulativeScore;
          const barColor =
            pct >= 80
              ? "bg-emerald-400"
              : pct >= 60
                ? "bg-amber-400"
                : "bg-orange-400";

          return (
            <div key={idx}>
              {/* アクション矢印 */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-16" />
                <div className="flex-1 flex items-center gap-2 pl-2">
                  <span className="text-emerald-500 text-sm font-bold">↑</span>
                  <span className="text-xs text-slate-600 font-medium">
                    +{step.scoreGain}点
                  </span>
                  <span className="text-xs text-slate-500 bg-tint-emerald border border-emerald-100 px-2 py-0.5 rounded-full">
                    #{step.priority} {step.action}
                  </span>
                </div>
              </div>

              {/* スコアバー */}
              <div className="flex items-center gap-3">
                <div className="w-16 text-right">
                  <span className="text-lg font-black text-slate-800">
                    {pct}
                  </span>
                  <span className="text-xs text-slate-500">点</span>
                </div>
                <div className="flex-1 h-10 flex items-center">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <div className="w-24">
                  {idx === steps.length - 1 && (
                    <span className="text-xs text-emerald-400 bg-tint-emerald border border-tint-emerald-border px-2 py-1 rounded-lg font-semibold">
                      最大改善後
                    </span>
                  )}
                </div>
              </div>

              {/* 詳細 */}
              <div className="flex items-start gap-3 mt-1">
                <div className="w-16" />
                <p className="text-xs text-slate-500 pl-2">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* サマリー */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          全アクション実施で{" "}
          <span className="font-bold text-emerald-400">{maxScore}点</span> に改善可能
        </div>
        <div className="text-xs text-slate-500">
          現在比 +{maxScore - baseScore}点
        </div>
      </div>
    </div>
  );
}
