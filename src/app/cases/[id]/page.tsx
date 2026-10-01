import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChecklistPanel } from "@/components/cases/checklist-panel";
import { CaseDeletePanel } from "@/components/cases/case-delete-panel";
import { BackToTop } from "@/components/shared/back-to-top";
import { RiskDimensionTable } from "@/components/results/risk-dimension-table";
import { RiskScoreCard } from "@/components/results/risk-score-card";
import { SourceEvidenceList } from "@/components/results/source-evidence-list";
import { ExecutiveSummary } from "@/components/results/executive-summary";
import { RiskMeter } from "@/components/results/risk-meter";
import { AiReviewMeeting } from "@/components/results/ai-review-meeting";
import { ImprovementSimulation } from "@/components/results/improvement-simulation";
import { WorstCaseScenarioCard } from "@/components/results/worst-case-scenario";
import { RiskHeatmap } from "@/components/results/risk-heatmap";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userEmail = await requireSessionEmail();
  const { id } = await params;
  const detail = await assertCaseOwner(id, userEmail);

  if (!detail) {
    notFound();
  }

  return (
    <Shell title={detail.case.productName}>
      {/* 案件情報カード */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-5 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-slate-500">型番</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.case.modelNumber}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">輸出先国</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.case.destinationCountry}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">顧客企業名</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{detail.case.customerCompanyName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <p className="text-sm leading-5 text-amber-800">
                本サービスは参考情報の提供を目的としており、法令上の最終判断を代替するものではありません。
                最終的な輸出可否の判断は利用者自身の責任で実施してください。
              </p>
            </div>

            {detail.assessment && (
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href={`/api/reports/${detail.case.id}/pdf`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold !text-white shadow-sm hover:bg-brand-navy-light"
                  target="_blank"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                  PDFを出力
                </Link>
                <Link href="/glossary" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  輸出用語辞典
                </Link>
              </div>
            )}
          </div>

          <div className="relative min-h-[200px] overflow-hidden border-t border-slate-100 bg-slate-50 lg:border-l lg:border-t-0">
            {detail.case.productImageUrl ? (
              <Image
                src={detail.case.productImageUrl}
                alt={detail.case.productName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p className="text-sm">商品画像なし</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {detail.assessment ? (
        <>
          {/* ① エグゼクティブサマリー */}
          <ExecutiveSummary
            caseRecord={detail.case}
            assessment={detail.assessment}
          />

          {/* ② リスクスコアカード */}
          <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <RiskScoreCard
                label="総合評価"
                grade={detail.assessment.summary.overall}
                description={detail.assessment.summary.headline}
              />
              <RiskScoreCard
                label="安全保障リスク"
                grade={detail.assessment.summary.security}
                description="制裁・エンドユーザー・用途・キャッチオール規制を統合"
              />
              <RiskScoreCard
                label="信用リスク"
                grade={detail.assessment.summary.credit}
                description="UBO・PEPs・ブランド毀損リスク"
              />
              <RiskScoreCard
                label="国リスク"
                grade={detail.assessment.summary.country}
                description="輸出先国の政情・規制変化・地政学リスク"
              />
            </div>
          </section>

          {/* ③ リスクメーター + ヒートマップ */}
          <div className="grid gap-4 md:grid-cols-2">
            <RiskMeter
              dimensions={detail.assessment.dimensions}
              summary={detail.assessment.summary}
            />
            <RiskHeatmap dimensions={detail.assessment.dimensions} />
          </div>

          {/* ④ AIモデル別診断（3列グリッド） */}
          {detail.assessment.modelResults && detail.assessment.modelResults.length > 0 && (() => {
            // 実際にAPIキーが設定されlive応答したプロバイダー数。
            // Claude/Geminiは未設定時もモック用のdimensionsを保持しているため、
            // dimensions.lengthではなくproviderStatus === "live"で判定する。
            const respondingModelCount = detail.assessment.modelResults.filter(
              (m) => m.providerStatus === "live",
            ).length;
            const isSingleRespondingModel = respondingModelCount <= 1;
            return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-violet-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {isSingleRespondingModel ? "AI個別評価" : `${respondingModelCount}AI個別評価`}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {isSingleRespondingModel
                        ? "現在有効なAIプロバイダーは1社のみです（他社はAPIキー未設定）"
                        : "各AIが独立して評価した詳細結果"}
                    </p>
                  </div>
                </div>
                {/* 一致率は複数プロバイダーの評価が比較できる場合のみ表示する。
                    単一プロバイダー時は比較対象がなく「一致率100%」が誤解を
                    招くため非表示にする。 */}
                {!isSingleRespondingModel && detail.assessment.agreementRate !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-slate-500">一致率</p>
                    <p className={`text-2xl font-black ${detail.assessment.agreementRate >= 80 ? "text-emerald-600" : detail.assessment.agreementRate >= 60 ? "text-amber-500" : "text-rose-600"}`}>
                      {detail.assessment.agreementRate}%
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {detail.assessment.modelResults.map((modelResult) => {
                  const modelMeta: Record<string, { label: string; badge: string }> = {
                    "gpt-4o": { label: "GPT-4o", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                    "claude": { label: "Claude", badge: "border-violet-200 bg-violet-50 text-violet-700" },
                    "gemini": { label: "Gemini", badge: "border-sky-200 bg-sky-50 text-sky-700" },
                    "mock": { label: "モック", badge: "border-slate-200 bg-slate-50 text-slate-500" },
                  };
                  const meta = modelMeta[modelResult.model] ?? modelMeta["mock"];
                  // 表示ラベル（"GPT-4o"等）は内部識別子に基づく固定文言であり、
                  // 実際にAPIが呼び出した具体的なモデル名（例: gpt-4o-mini）とは
                  // 異なる場合がある。実測値がある場合は括弧書きで併記し、
                  // 廉価モデルを上位モデルと誤認させないようにする。
                  const actualModelSuffix = modelResult.actualModelName
                    ? ` (${modelResult.actualModelName})`
                    : "";
                  const overallGrade = modelResult.dimensions.reduce<"A" | "B" | "C">((worst, d) => {
                    if (d.grade === "C") return "C";
                    if (d.grade === "B" && worst !== "C") return "B";
                    return worst;
                  }, "A");
                  const gradeStyle = overallGrade === "C" ? "text-red-600 bg-red-50 border-red-200" : overallGrade === "B" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-emerald-600 bg-emerald-50 border-emerald-200";

                  return (
                    <div key={modelResult.model} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${meta.badge}`}>
                          {meta.label}
                          {actualModelSuffix}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-sm font-bold ${gradeStyle}`}>
                          {overallGrade}
                        </span>
                      </div>

                      {modelResult.providerStatusLabel && (
                        <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                          <span className="text-[11px] font-semibold text-slate-500">接続状態</span>
                          <span className={`text-[11px] font-bold ${
                            modelResult.providerStatus === "live"
                              ? "text-emerald-600"
                              : modelResult.providerStatus === "fallback-error"
                                ? "text-red-600"
                                : "text-amber-600"
                          }`}>
                            {modelResult.providerStatusLabel}
                          </span>
                        </div>
                      )}

                      {modelResult.providerReason && modelResult.providerStatus !== "live" && (
                        <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
                          {modelResult.providerReason}
                        </p>
                      )}

                      {/* reviewComment */}
                      {modelResult.reviewComment && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-3 bg-slate-50 rounded-lg p-2">
                          {modelResult.reviewComment}
                        </p>
                      )}

                      <div className="space-y-1.5">
                        {modelResult.dimensions.map((dim) => {
                          const dimGradeColor = dim.grade === "C" ? "bg-red-100 text-red-700" : dim.grade === "B" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
                          return (
                            <div key={dim.dimension} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-semibold text-slate-800">{dim.label}</p>
                                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${dimGradeColor}`}>
                                  {dim.grade} / {dim.score}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 相違点ハイライト（複数プロバイダーが応答した場合のみ意味を持つ） */}
              {!isSingleRespondingModel && detail.assessment.disagreementDimensions && detail.assessment.disagreementDimensions.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold text-amber-800">
                    評価が割れた項目: {detail.assessment.disagreementDimensions.join("、")}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    AIによって判断が異なる項目は、追加調査・確認を特に推奨します。
                  </p>
                </div>
              )}
            </section>
            );
          })()}

          {/* ④-2 マルチAIコンセンサス（多数決/重み付け集計、詳細は展開して確認） */}
          {/* 有効なAIプロバイダーが1社のみの場合は「多数決」「コンセンサス」という表現を使わず、
              単一プロバイダーによる分析結果である旨を明示する（誤解防止） */}
          {detail.assessment.crossReview && detail.assessment.crossReview.dimensions.length > 0 && (() => {
            const isSingleProvider = detail.assessment.crossReview.participatingProviders.length === 1;
            return (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <details>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {isSingleProvider ? "AI分析結果（詳細）" : "マルチAIコンセンサス（詳細）"}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {detail.assessment.crossReview.isフォールバックOnly
                          ? "現在はモック応答で動作中です（APIキー未設定）"
                          : isSingleProvider
                            ? "現在は1社のAIのみが有効です。他プロバイダーのAPIキーが未設定のため、多数決・コンセンサスではなく単独の分析結果として表示しています。"
                            : `${detail.assessment.crossReview.participatingProviders.length}件のAIによる統合評価・信頼度: ${detail.assessment.crossReview.confidenceLevel}（${detail.assessment.crossReview.confidenceScore}%）`}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-bold ${
                        detail.assessment.crossReview.overallConsensusGrade === "C"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : detail.assessment.crossReview.overallConsensusGrade === "B"
                            ? "text-amber-600 bg-amber-50 border-amber-200"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200"
                      }`}
                    >
                      {detail.assessment.crossReview.overallConsensusGrade}
                    </span>
                  </div>
                </summary>

                <div className="mt-4 space-y-2">
                  {detail.assessment.crossReview.dimensions.map((dim) => (
                    <div
                      key={dim.dimension}
                      className={`rounded-lg border px-3 py-2 ${
                        dim.hasDisagreement ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{dim.label}</p>
                        <span className="text-xs font-bold text-slate-600">
                          {isSingleProvider ? "評価" : "多数決"}: {dim.consensusGrade}（{dim.consensusScore}点）
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        {dim.votes.map((vote) => (
                          <span key={vote.model}>
                            {vote.modelLabel}: {vote.grade}（{vote.score}）
                          </span>
                        ))}
                      </div>
                      {!isSingleProvider && dim.hasDisagreement && (
                        <p className="mt-1 text-[11px] font-semibold text-amber-700">
                          AIの評価が分かれています（要確認）
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {detail.assessment.crossReview.skippedProviders.length > 0 && !detail.assessment.crossReview.isフォールバックOnly && (
                  <p className="mt-3 text-[11px] text-slate-500">
                    APIキー未設定のためスキップされたプロバイダー: {detail.assessment.crossReview.skippedProviders.join("、")}
                  </p>
                )}
              </details>
            </section>
            );
          })()}

          {/* ⑤ AIレビュー会議タイムライン */}
          {detail.assessment.reviewMeeting && detail.assessment.reviewMeeting.length > 0 && (
            <AiReviewMeeting
              reviewMeeting={detail.assessment.reviewMeeting}
              agreementRate={detail.assessment.agreementRate ?? 100}
              disagreementDimensions={detail.assessment.disagreementDimensions ?? []}
              summary={detail.assessment.summary}
            />
          )}

          {/* ⑥ 改善シミュレーション */}
          {detail.assessment.improvementSteps && detail.assessment.improvementSteps.length > 0 && (
            <ImprovementSimulation
              steps={detail.assessment.improvementSteps}
              baseScore={detail.assessment.improvementSteps[0]
                ? detail.assessment.improvementSteps[0].cumulativeScore - detail.assessment.improvementSteps[0].scoreGain
                : Math.max(0, 100 - Math.round(detail.assessment.dimensions.reduce((s, d) => s + d.score, 0) / (detail.assessment.dimensions.length || 1)))}
            />
          )}

          {/* ⑦ 最悪ケースシミュレーション */}
          {detail.assessment.worstCaseScenarios && detail.assessment.worstCaseScenarios.length > 0 && (
            <WorstCaseScenarioCard scenarios={detail.assessment.worstCaseScenarios} />
          )}

          {/* ⑧ 判断根拠・推奨アクション */}
          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            {/* 判断根拠テキスト */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-slate-900">判断根拠・AIサマリー</h2>
              </div>
              <p className="text-sm leading-7 text-slate-700">{detail.assessment.summary.summary}</p>
              {detail.assessment.reportNarrative && (
                <p className="mt-3 text-sm leading-7 text-slate-600">{detail.assessment.reportNarrative}</p>
              )}
            </div>

            {/* 推奨アクション（★優先度付き） */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-emerald-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-slate-900">推奨アクション</h2>
              </div>
              <ul className="space-y-2">
                {detail.assessment.summary.nextActions.map((action, idx) => {
                  const starCount = Math.max(1, 5 - idx);
                  return (
                    <li key={action} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-blue-50/50 px-4 py-3">
                      <span className="flex shrink-0 gap-0.5 pt-0.5">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <svg
                            key={starIdx}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`h-3.5 w-3.5 ${starIdx < starCount ? "text-amber-400" : "text-slate-200"}`}
                          >
                            <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l1.83 4.401 4.753.381c1.164.093 1.636 1.545.749 2.305l-3.622 3.104 1.106 4.637c.271 1.136-.964 2.033-1.96 1.425L12 16.951l-4.068 2.512c-.996.608-2.231-.289-1.96-1.425l1.106-4.637-3.622-3.104c-.887-.76-.415-2.212.749-2.305l4.753-.38 1.83-4.402Z" />
                          </svg>
                        ))}
                      </span>
                      <span className="text-sm text-slate-700 leading-relaxed">{action}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* ⑨ 評価軸テーブル */}
          <RiskDimensionTable items={detail.assessment.dimensions} />

          {/* ⑩ チェックリスト */}
          <ChecklistPanel caseId={detail.case.id} initialItems={detail.case.checklist} />

          {/* ⑪ エビデンス一覧 */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-slate-900">参照エビデンス一覧</h2>
            <SourceEvidenceList items={detail.assessment.evidence} />
          </section>

          {/* ⑫ AI相談ボタン */}
          <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-brand-navy to-brand-navy-light p-6 text-white text-center">
            <h2 className="text-lg font-bold mb-2">この案件についてAIへ質問する</h2>
            <p className="text-sm text-blue-100 mb-4">
              「なぜB評価？」「中国へ輸出すると？」など、このレポートの内容を踏まえてAIに直接相談できます。
            </p>
            <Link
              href={`/cases/${detail.case.id}/chat`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-navy shadow-lg hover:bg-blue-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
              AIに質問する
            </Link>
          </section>
        </>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-100 opacity-75" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-brand-navy">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-base font-semibold text-slate-900">調査結果を準備中です</h2>
          <p className="mt-2 text-sm text-slate-500">
            まだ評価結果がありません。調査開始後に再読み込みしてください。
          </p>
        </section>
      )}

      <CaseDeletePanel caseId={detail.case.id} productName={detail.case.productName} />
      <BackToTop />
    </Shell>
  );
}
