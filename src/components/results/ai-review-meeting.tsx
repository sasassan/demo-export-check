"use client";

import type { ReviewMeetingEntry, AssessmentRecord } from "@/lib/types";

type Props = {
  reviewMeeting: ReviewMeetingEntry[];
  agreementRate: number;
  disagreementDimensions: string[];
  summary: AssessmentRecord["summary"];
};

const modelIcon: Record<string, string> = {
  "gpt-4o": "G",
  claude: "C",
  gemini: "✦",
  mock: "?",
};

const modelColor: Record<string, string> = {
  "gpt-4o": "bg-emerald-600",
  claude: "bg-violet-600",
  gemini: "bg-blue-600",
  mock: "bg-gray-500",
};

const gradeColor: Record<string, string> = {
  A: "text-emerald-700 bg-emerald-50 border-emerald-200",
  B: "text-amber-700 bg-amber-50 border-amber-200",
  C: "text-red-700 bg-red-50 border-red-200",
};

export function AiReviewMeeting({
  reviewMeeting,
  agreementRate,
  disagreementDimensions,
  summary,
}: Props) {
  if (!reviewMeeting || reviewMeeting.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">AIレビュー会議</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            3つのAIが独立して評価し、議論した結果です
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">AI評価一致率</p>
          <p
            className={`text-2xl font-black ${
              agreementRate >= 80
                ? "text-emerald-600"
                : agreementRate >= 60
                  ? "text-amber-500"
                  : "text-red-600"
            }`}
          >
            {agreementRate}%
          </p>
          <p className="text-xs text-gray-400">
            {agreementRate >= 80
              ? "高信頼性"
              : agreementRate >= 60
                ? "中程度の一致"
                : "評価が割れています"}
          </p>
        </div>
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 縦線 */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />

        <div className="space-y-4">
          {reviewMeeting.map((entry, idx) => (
            <div key={entry.model} className="relative flex gap-4">
              {/* アイコン */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${modelColor[entry.model] ?? "bg-gray-500"}`}
              >
                {modelIcon[entry.model] ?? "?"}
              </div>

              {/* コンテンツ */}
              <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-800">
                    {entry.modelLabel}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor[entry.overallGrade]}`}
                  >
                    判定: {entry.overallGrade}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {entry.reviewComment}
                </p>
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-xs font-semibold text-red-600 flex-shrink-0">
                    主なリスク:
                  </span>
                  <span className="text-xs text-gray-600">{entry.keyRisk}</span>
                </div>
              </div>

              {/* 矢印（最後以外） */}
              {idx < reviewMeeting.length - 1 && (
                <div className="absolute left-5 bottom-0 translate-y-full flex items-center justify-center w-10 pt-1">
                  <span className="text-gray-300 text-lg">↓</span>
                </div>
              )}
            </div>
          ))}

          {/* 統合判定 */}
          <div className="relative flex gap-4">
            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-slate-800">
              ★
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm font-bold text-slate-800 mb-1">統合判定</p>
              <p className="text-sm text-slate-700">{summary.summary}</p>
              {disagreementDimensions.length > 0 && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                  <span className="font-semibold">評価が割れた項目: </span>
                  {disagreementDimensions.join("、")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
