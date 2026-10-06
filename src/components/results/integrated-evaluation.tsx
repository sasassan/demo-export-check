"use client";

import type { IntegratedEvaluationSummary } from "@/lib/types";

type Props = {
  evaluation: IntegratedEvaluationSummary;
};

const gradeColor: Record<string, string> = {
  A: "text-emerald-400 bg-tint-emerald border-tint-emerald-border",
  B: "text-amber-400 bg-tint-amber border-tint-amber-border",
  C: "text-red-400 bg-tint-red border-tint-red-border",
};

const modelBadge: Record<string, string> = {
  "gpt-4o": "border-tint-emerald-border bg-tint-emerald text-emerald-400",
  claude: "border-violet-400/40 bg-tint-violet text-violet-400",
  gemini: "border-sky-400/40 bg-tint-sky text-sky-400",
  mock: "border-slate-200 bg-slate-50 text-slate-500",
};

const confidenceBadge: Record<string, string> = {
  高: "border-tint-emerald-border bg-tint-emerald text-emerald-400",
  中: "border-tint-amber-border bg-tint-amber text-amber-400",
  低: "border-tint-rose-border bg-tint-rose text-rose-400",
};

const confidenceLabel: Record<string, string> = {
  高: "確信度高",
  中: "確信度中",
  低: "確信度低",
};

/**
 * 「3つのAIによる統合評価」セクション。
 * 一致点（全AIの判定が一致 → 確信度高）と
 * 不一致点（判定が割れた項目 → 各AIの見解を両論併記）を分けて提示する。
 */
export function IntegratedEvaluation({ evaluation }: Props) {
  if (!evaluation || evaluation.participatingProviders.length === 0) return null;

  const isSingleProvider = evaluation.participatingProviders.length === 1;

  return (
    <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{evaluation.title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {evaluation.isフォールバックOnly
              ? "現在はモック応答で動作中です（APIキー未設定）"
              : isSingleProvider
                ? "現在有効なAIプロバイダーは1社のみです。他プロバイダーのAPIキーが未設定のため、単独の分析結果として表示しています。"
                : `参加AI: ${evaluation.participatingProviders
                    .map((model) => (model === "gpt-4o" ? "GPT-4o" : model === "claude" ? "Claude" : model === "gemini" ? "Gemini" : model))
                    .join("・")} ／ 統合信頼度: ${evaluation.confidenceLevel}（${evaluation.confidenceScore}%）`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-full border px-3 py-1 text-sm font-bold ${gradeColor[evaluation.overallConsensusGrade]}`}
          >
            統合判定: {evaluation.overallConsensusGrade}
          </span>
        </div>
      </div>

      {/* 一致点 */}
      {evaluation.agreementPoints.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-slate-900">
              全AIの判定が一致した項目
            </p>
          </div>
          <div className="space-y-2">
            {evaluation.agreementPoints.map((point) => (
              <div
                key={point.dimension}
                className="rounded-xl border border-tint-emerald-border bg-tint-emerald/60 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{point.label}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${confidenceBadge[point.confidence]}`}
                    >
                      {confidenceLabel[point.confidence]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">
                      統合: {point.consensusGrade}（{point.consensusScore}点）
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {point.opinions.map((opinion) => (
                        <span
                          key={opinion.model}
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${modelBadge[opinion.model] ?? modelBadge["mock"]}`}
                        >
                          {opinion.modelLabel}: {opinion.grade}（{opinion.score}）
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {point.opinions.length > 0 && point.opinions[0]?.rationale && (
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {point.opinions[0].rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 不一致点（両論併記） */}
      {evaluation.disagreementPoints.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-400">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-semibold text-slate-900">
              AIで評価が分かれた項目（両論併記）
            </p>
          </div>
          <div className="space-y-2">
            {evaluation.disagreementPoints.map((point) => (
              <div
                key={point.dimension}
                className="rounded-xl border border-tint-amber-border bg-tint-amber/60 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{point.label}</p>
                  <span className="text-xs font-bold text-slate-600">
                    統合: {point.consensusGrade}（{point.consensusScore}点）
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  {point.opinions.map((opinion) => (
                    <div
                      key={opinion.model}
                      className="rounded-lg border border-slate-200 bg-panel px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${modelBadge[opinion.model] ?? modelBadge["mock"]}`}
                        >
                          {opinion.modelLabel}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${gradeColor[opinion.grade]}`}
                        >
                          {opinion.grade}（{opinion.score}点）
                        </span>
                      </div>
                      {opinion.rationale && (
                        <p className="mt-1 text-sm leading-6 text-slate-700">{opinion.rationale}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] font-semibold text-amber-400">
                  AIによって判断が分かれているため、追加調査・確認を特に推奨します。
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
