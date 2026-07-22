"use client";

import type { WorstCaseScenario } from "@/lib/types";

type Props = {
  scenarios: WorstCaseScenario[];
};

const probColor: Record<string, string> = {
  低: "bg-emerald-100 text-emerald-700 border-emerald-200",
  中: "bg-amber-100 text-amber-700 border-amber-200",
  高: "bg-red-100 text-red-700 border-red-200",
};

const gradeColor: Record<string, string> = {
  A: "text-emerald-700",
  B: "text-amber-600",
  C: "text-red-600",
};

export function WorstCaseScenarioCard({ scenarios }: Props) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900">
          最悪ケースシミュレーション
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          条件が変わった場合に想定されるリスクシナリオ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {scenarios.map((s, idx) => (
          <div
            key={idx}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-red-50 transition-colors"
          >
            {/* シナリオタイトル */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold text-gray-800">
                もし {s.scenario}
              </p>
              <span
                className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${probColor[s.probability]}`}
              >
                確率: {s.probability}
              </span>
            </div>

            {/* インパクト */}
            <p className="text-xs text-gray-600 leading-relaxed">{s.impact}</p>

            {/* グレード変化 */}
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <span>この場合の評価:</span>
              <span className={`font-black text-sm ${gradeColor[s.grade]}`}>
                {s.grade}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
        ※ これらはAIによる仮定シナリオです。実際の判断は輸出管理担当者・法務部門にご確認ください。
      </p>
    </div>
  );
}
