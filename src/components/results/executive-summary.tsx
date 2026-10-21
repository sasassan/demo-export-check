"use client";

import { DocumentInvoiceIcon } from "@/components/icons/trade-icons";
import { computeSafetyScore } from "@/lib/risk/scoring";
import type { CaseRecord, AssessmentRecord } from "@/lib/types";

const gradeColor: Record<string, string> = {
  A: "bg-tint-emerald-strong text-emerald-400 border-tint-emerald-border",
  B: "bg-tint-amber-strong text-amber-300 border-tint-amber-border",
  C: "bg-tint-rose-strong text-rose-400 border-tint-rose-border",
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
  const liveModelCount =
    modelResults?.filter((m) => m.providerStatus === "live").length ?? 0;

  // 調査カバレッジと調査済み項目の評価点を分離して計算する。
  // 未調査項目を除外した平均値を「総合安全スコア」として表示しない。
  const breakdown = computeSafetyScore(assessment.dimensions);

  return (
    <div className="bg-panel border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:shadow-none">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-brand-deep to-brand-deep-light px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <DocumentInvoiceIcon aria-hidden="true" className="h-5 w-5 text-white/85" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-medium uppercase tracking-wider">
              輸出リスク評価レポート
            </p>
            <h2 className="text-white text-lg font-bold mt-0.5">
              エグゼクティブサマリー
            </h2>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden inline-flex min-h-9 items-center justify-center rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
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
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-sm text-slate-900 font-semibold mt-0.5">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* 判定理由・注意事項 */}
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1">判定サマリー</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {summary.summary}
            </p>
          </div>

          {assessment.dimensions.filter((d) => d.grade !== "A").length > 0 && (
            <div className="bg-tint-amber border border-tint-amber-border rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-300 mb-1">
                重要な注意事項
              </p>
              <ul className="space-y-0.5">
                {assessment.dimensions
                  .filter((d) => d.grade !== "A")
                  .map((d) => (
                    <li key={d.dimension} className="text-xs text-amber-400">
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

          {/* スコア（調査カバレッジと調査済み項目の評価点を分離表示） */}
          <div className="text-center space-y-2">
            <div>
              <p className="text-xs text-slate-500">調査カバレッジ</p>
              <p className="text-2xl font-bold text-slate-900">
                {breakdown.investigatedCount}
                <span className="text-sm font-semibold text-slate-500">
                  {" "}/ {breakdown.totalCount} 項目
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">調査済み項目の平均評価点</p>
              <p className="text-lg font-semibold text-slate-700">{breakdown.averageRiskScore} 点</p>
            </div>
            {!breakdown.isComplete && (
              <p className="text-xs font-semibold text-amber-600">
                未調査 {breakdown.missingCount} 項目あり（要確認）
              </p>
            )}
          </div>

          {/* 一致率（実際に応答した有効プロバイダーが2社以上の場合のみ表示） */}
          {agreementRate !== undefined && liveModelCount >= 2 && (
            <div className="text-center">
              <p className="text-xs text-slate-500">AI一致率</p>
              <p
                className={`text-lg font-bold ${
                  agreementRate >= 80
                    ? "text-emerald-400"
                    : agreementRate >= 60
                      ? "text-amber-400"
                      : "text-rose-400"
                }`}
              >
                {agreementRate}%
              </p>
              <p className="text-xs text-slate-500">
                {agreementRate >= 80 ? "高信頼" : agreementRate >= 60 ? "中信頼" : "要検討"}
              </p>
            </div>
          )}
          {liveModelCount === 1 && (
            <div className="text-center">
              <p className="text-xs text-slate-500">分析AI</p>
              <p className="text-sm font-semibold text-slate-700">1社の分析結果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
