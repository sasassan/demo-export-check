"use client";

import { RouteMapDecoration } from "@/components/icons/trade-illustrations";
import type { ReviewMeetingEntry, AssessmentRecord } from "@/lib/types";

type Props = {
  reviewMeeting: ReviewMeetingEntry[];
  agreementRate: number;
  disagreementDimensions: string[];
  summary: AssessmentRecord["summary"];
};

const modelIcon: Record<string, string> = {
  "gpt-4o": "O",
  claude: "C",
  gemini: "G",
  mock: "?",
};

const modelColor: Record<string, string> = {
  "gpt-4o": "bg-emerald-600",
  claude: "bg-violet-600",
  gemini: "bg-blue-600",
  mock: "bg-slate-300",
};

const gradeColor: Record<string, string> = {
  A: "text-emerald-400 bg-tint-emerald border-tint-emerald-border",
  B: "text-amber-400 bg-tint-amber border-tint-amber-border",
  C: "text-rose-400 bg-tint-rose border-tint-rose-border",
};

export function AiReviewMeeting({
  reviewMeeting,
  agreementRate,
  disagreementDimensions,
  summary,
}: Props) {
  if (!reviewMeeting || reviewMeeting.length === 0) return null;

  // 有効なAIプロバイダーが1社のみの場合、比較対象がなく「一致率」「議論」
  // という表現が成立しないため、単独評価である旨を明示する。
  const isSingleProvider = reviewMeeting.length === 1;

  return (
    <div className="bg-panel border border-slate-200 rounded-2xl shadow-sm p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isSingleProvider ? "AI分析結果" : "AIレビュー会議"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSingleProvider
              ? "現在有効なAIプロバイダーは1社のみです。他社はAPIキー未設定のため、単独の分析結果として表示しています。"
              : `${reviewMeeting.length}つのAIが独立して評価し、議論した結果です`}
          </p>
        </div>
        {!isSingleProvider && (
          <div className="text-right">
            <p className="text-xs text-slate-500">AI評価一致率</p>
            <p
              className={`text-2xl font-black ${
                agreementRate >= 80
                  ? "text-emerald-400"
                  : agreementRate >= 60
                    ? "text-amber-500"
                    : "text-rose-400"
              }`}
            >
              {agreementRate}%
            </p>
            <p className="text-xs text-slate-500">
              {agreementRate >= 80
                ? "高信頼性"
                : agreementRate >= 60
                  ? "中程度の一致"
                  : "評価が割れています"}
            </p>
          </div>
        )}
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 縦線（ルートマップ風） */}
        <RouteMapDecoration
          aria-hidden="true"
          className="absolute left-2.5 top-0 bottom-0 h-full w-5 text-brand-navy/50"
          preserveAspectRatio="none"
        />

        <div className="space-y-4">
          {reviewMeeting.map((entry, idx) => (
            <div key={entry.model} className="relative flex gap-4">
              {/* アイコン */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${modelColor[entry.model] ?? "bg-slate-300"}`}
              >
                {modelIcon[entry.model] ?? "?"}
              </div>

              {/* コンテンツ */}
              <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 trade-hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">
                    {entry.modelLabel}
                    {entry.actualModelName && (
                      <span className="ml-1 font-normal text-slate-600">
                        ({entry.actualModelName})
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor[entry.overallGrade]}`}
                  >
                    判定: {entry.overallGrade}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {entry.reviewComment}
                </p>
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-xs font-semibold text-rose-400 flex-shrink-0">
                    主なリスク:
                  </span>
                  <span className="text-xs text-slate-600">{entry.keyRisk}</span>
                </div>
              </div>

              {/* 矢印（最後以外） */}
              {idx < reviewMeeting.length - 1 && (
                <div className="absolute left-5 bottom-0 translate-y-full flex items-center justify-center w-10 pt-1">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-600">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}

          {/* 統合判定 */}
          <div className="relative flex gap-4">
            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-brand-deep">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.005 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.627 2.824c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-sm font-bold text-slate-800 mb-1">統合判定</p>
              <p className="text-sm text-slate-700">{summary.summary}</p>
              {disagreementDimensions.length > 0 && (
                <div className="mt-2 text-xs text-amber-400 bg-tint-amber rounded-lg px-3 py-2 border border-tint-amber-border">
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
