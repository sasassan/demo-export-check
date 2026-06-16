import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChecklistPanel } from "@/components/cases/checklist-panel";
import { ReportPreview } from "@/components/reports/report-preview";
import { RiskDimensionTable } from "@/components/results/risk-dimension-table";
import { RiskScoreCard } from "@/components/results/risk-score-card";
import { SourceEvidenceList } from "@/components/results/source-evidence-list";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";

const dimensionGroups = {
  country: ["country"],
  endUser: ["endUser", "sanctions", "ubo", "peps"],
  useCase: ["useCase", "catchAll", "reputation"],
} as const;

function dimensionMatches(
  dimension: string,
  allowed: readonly string[],
) {
  return allowed.includes(dimension);
}

const dimensionGroupMeta = {
  country: {
    title: "国リスク",
    description: "輸出先国の規制環境、地政学、制裁関連の観点を整理します。",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  endUser: {
    title: "エンドユーザーリスク",
    description: "顧客実在性、制裁該当性、支配関係など相手先の観点を整理します。",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  useCase: {
    title: "用途リスク",
    description: "用途、転用可能性、キャッチオール該当可能性などを整理します。",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
} as const;

function maxGradeValue(grade: "A" | "B" | "C") {
  if (grade === "C") return 3;
  if (grade === "B") return 2;
  return 1;
}

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
      <section className="overflow-hidden rounded-[1.75rem] border border-indigo-200/50 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-5 p-6">
            {/* メタ情報 */}
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

            {/* 注意書き */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <p className="text-xs leading-5 text-amber-800">
                本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
                最終的な輸出可否の判断は利用者自身の責任で実施してください。
              </p>
            </div>

            {detail.assessment && (
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href={`/cases/${detail.case.id}/report`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  レポート確認
                </Link>
                <Link
                  href={`/api/reports/${detail.case.id}/pdf`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
                  target="_blank"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                  </svg>
                  PDFを出力
                </Link>
              </div>
            )}
          </div>

          {/* 商品画像 */}
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
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <p className="text-xs">商品画像なし</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {detail.assessment ? (
        <>
          {(() => {
            const dimensionsByKey = new Map(
              detail.assessment.dimensions.map((item) => [item.dimension, item]),
            );
            const evidenceByGroup = {
              country: detail.assessment.evidence.filter((item) =>
                dimensionMatches(item.dimension, dimensionGroups.country),
              ),
              endUser: detail.assessment.evidence.filter((item) =>
                dimensionMatches(item.dimension, dimensionGroups.endUser),
              ),
              useCase: detail.assessment.evidence.filter((item) =>
                dimensionMatches(item.dimension, dimensionGroups.useCase),
              ),
            };

            const groupedRiskViews = Object.entries(dimensionGroups).map(([groupKey, keys]) => {
              const groupDimensions = keys
                .map((key) => dimensionsByKey.get(key))
                .filter((item): item is NonNullable<typeof item> => Boolean(item));
              const highestGrade = groupDimensions.reduce<"A" | "B" | "C">((current, item) => {
                return maxGradeValue(item.grade) > maxGradeValue(current) ? item.grade : current;
              }, "A");

              return {
                key: groupKey as keyof typeof dimensionGroups,
                highestGrade,
                dimensions: groupDimensions,
                evidence: evidenceByGroup[groupKey as keyof typeof evidenceByGroup].slice(0, 3),
              };
            });

            return (
              <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-indigo-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">判定理由の要約</h2>
                      <p className="text-sm text-slate-500">どの論点が評価に影響したかを整理しています。</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {groupedRiskViews.map((group) => {
                      const meta = dimensionGroupMeta[group.key];
                      return (
                        <div key={group.key} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.iconBg}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`h-5 w-5 ${meta.iconColor}`}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9Zm0 4.5v5.25l3.75 2.25" />
                                </svg>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-semibold text-slate-900">{meta.title}</h3>
                                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                                    評価 {group.highestGrade}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm leading-6 text-slate-500">{meta.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3">
                            {group.dimensions.map((item) => (
                              <div key={item.dimension} className="rounded-xl border border-white bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    {item.grade} / {item.score}点
                                  </span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{item.rationale}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-emerald-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">推奨アクション</h2>
                      <p className="text-sm text-slate-500">次に何を確認すべきか、実務向けに並べています。</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {detail.assessment.summary.nextActions.map((action, index) => (
                      <div key={action} className="rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">推奨対応 {index + 1}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{action}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    {groupedRiskViews.map((group) => {
                      const meta = dimensionGroupMeta[group.key];
                      return (
                        <div key={`${group.key}-evidence`} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <h3 className="text-sm font-semibold text-slate-900">{meta.title}の根拠</h3>
                          {group.evidence.length > 0 ? (
                            <div className="mt-3 space-y-3">
                              {group.evidence.map((item) => (
                                <div key={item.id} className="rounded-xl bg-slate-50 px-3 py-3">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                                    <span className="text-xs font-medium text-slate-500">
                                      信頼度 {Math.round(item.confidence * 100)}%
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">この論点に紐づく補足根拠はまだありません。</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* リスクスコアカード */}
          <section className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <RiskScoreCard
                label="総合評価"
                grade={detail.assessment.summary.overall}
                description={detail.assessment.summary.headline}
              />
              <RiskScoreCard
                label="安全保障リスク"
                grade={detail.assessment.summary.security}
                description="制裁・エンドユーザー・用途・キャッチオールを統合して表示します。"
              />
              <RiskScoreCard
                label="信用リスク"
                grade={detail.assessment.summary.credit}
                description="UBO・PEPs・ブランド毀損リスクを中心に評価します。"
              />
              <RiskScoreCard
                label="国リスク"
                grade={detail.assessment.summary.country}
                description="輸出先国の政情・規制変化・地政学リスクを表示します。"
              />
            </div>
          </section>

          {/* AI要約 */}
          <section className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-indigo-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900">AIの要約</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">{detail.assessment.summary.summary}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{detail.assessment.reportNarrative}</p>
          </section>

          {/* アクション + 右カラム */}
          <section className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-4">
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-emerald-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold text-slate-900">AI診断アクション</h2>
                </div>
                <ul className="mt-4 space-y-3">
                  {detail.assessment.summary.nextActions.map((action) => (
                    <li key={action} className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-600 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">直感的な判断サポート</p>
                <h2 className="mt-2 text-xl font-bold">次に確認すべき項目がすぐわかる</h2>
                <p className="mt-3 text-sm leading-7 text-indigo-50">
                  AIが要約・根拠・アクションをまとめて表示するため、担当者は追加確認の優先順位を迷わず決められます。
                </p>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                    <p className="text-xs text-indigo-100">推奨フロー</p>
                    <p className="mt-1 text-sm font-semibold">要約確認 → 根拠確認 → PDF共有</p>
                  </div>
                  <div className="rounded-xl bg-white/15 px-4 py-3 backdrop-blur">
                    <p className="text-xs text-indigo-100">社内共有向け</p>
                    <p className="mt-1 text-sm font-semibold">営業・法務・輸出管理で共通の見え方</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ChecklistPanel caseId={detail.case.id} initialItems={detail.case.checklist} />

          {/* 評価軸テーブル */}
          <RiskDimensionTable items={detail.assessment.dimensions} />

          {/* 根拠ソース */}
          <section>
            <h2 className="mb-3 text-base font-semibold text-slate-900">根拠ソース</h2>
            <SourceEvidenceList items={detail.assessment.evidence} />
          </section>

          {/* PDFレポート */}
          <ReportPreview detail={detail} />
        </>
      ) : (
        <section className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white/95 px-6 py-16 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">調査結果を準備中です</h2>
          <p className="mt-2 text-sm text-slate-500">
            まだ評価結果がありません。調査開始APIの実行後に再読み込みしてください。
          </p>
        </section>
      )}
    </Shell>
  );
}
