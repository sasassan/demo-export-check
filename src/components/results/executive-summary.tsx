"use client";

import type { CaseRecord, AssessmentRecord } from "@/lib/types";

const gradeColor: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-800 border-emerald-300",
  B: "bg-amber-100 text-amber-800 border-amber-300",
  C: "bg-red-100 text-red-800 border-red-300",
};

const gradeLabel: Record<string, string> = {
  A: "問題なし",
  B: "要確認",
  C: "高リスク",
};

type Props = {
  caseRecord: CaseRecord;
  assessment: AssessmentRecord;
};

export function ExecutiveSummary({ caseRecord, assessment }: Props) {
  const { summary, agreementRate, modelResults } = assessment;
  const grade = summary.overall;

  // 総合スコアを次元の平均から計算
  const avgScore =
    assessment.dimensions.length > 0
      ? Math.round(
          assessment.dimensions.reduce((s, d) => s + d.score, 0) /
            assessment.dimensions.length,
        )
      : 0;
  const safetyScore = Math.max(0, 100 - avgScore);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden print:shadow-none">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-slate-300 text-xs font-medium uppercase tracking-wider">
            輸出リスク評価レポート
          </p>
          <h2 className="text-white text-lg font-bold mt-0.5">
            エグゼクティブサマリー
          </h2>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          印刷 / PDF
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 案件情報 */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "製品名", value: caseRecord.productName },
              { label: "型番", value: caseRecord.modelNumber },
              { label: "輸出先", value: caseRecord.destinationCountry },
              { label: "顧客企業", value: caseRecord.customerCompanyName },
              {
                label: "評価日時",
                value: new Date(assessment.updatedAt).toLocaleString("ja-JP"),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-sm text-gray-900 font-semibold mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* 判定理由・注意事項 */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">判定サマリー</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {summary.summary}
            </p>
          </div>

          {assessment.dimensions.filter((d) => d.grade !== "A").length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-800 mb-1">
                重要な注意事項
              </p>
              <ul className="space-y-0.5">
                {assessment.dimensions
                  .filter((d) => d.grade !== "A")
                  .map((d) => (
                    <li key={d.dimension} className="text-xs text-amber-700">
                      ・{d.label}：{d.rationale.slice(0, 60)}…
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* 総合評価パネル */}
        <div className="flex flex-col items-center justify-center gap-4">
          {/* グレードバッジ */}
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${gradeColor[grade]}`}
          >
            <span className="text-5xl font-black">{grade}</span>
            <span className="text-xs font-semibold">{gradeLabel[grade]}</span>
          </div>

          {/* スコア */}
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{safetyScore}</p>
            <p className="text-xs text-gray-500">/ 100点</p>
          </div>

          {/* 一致率 */}
          {agreementRate !== undefined && modelResults && modelResults.length >= 2 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">AI一致率</p>
              <p
                className={`text-lg font-bold ${
                  agreementRate >= 80
                    ? "text-emerald-600"
                    : agreementRate >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {agreementRate}%
              </p>
              <p className="text-xs text-gray-400">
                {agreementRate >= 80 ? "高信頼" : agreementRate >= 60 ? "中信頼" : "要検討"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
