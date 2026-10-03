import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "監修・レビュー体制",
  description:
    "輸出リスクナビ（Export Risk Navi）の監修・レビュー体制、未提供範囲、実務利用時の推奨運用を整理したページです。",
  path: "/supervision",
});

const currentReviewFlow = [
  "輸出管理の実務課題を前提としたプロダクト設計レビュー",
  "公開ページ、デモ、AI相談室の導線や説明責任に対する外部レビュー・改善反映",
  "免責、セキュリティ、公開範囲の明示による誤利用防止",
  "AI出力の根拠提示、確認アクション、関連条文表示などの改善を継続反映",
];

const notYetPublished = [
  "弁護士・行政書士・通関士等の氏名付き外部監修表示",
  "個別案件に対する法的結論の保証",
  "正式な法務意見書・適法性保証・制裁照合の最終責任代行",
];

const recommendedUse = [
  "営業担当が一次確認と論点整理を行う",
  "必要に応じて社内輸出管理担当・法務・責任者にエスカレーションする",
  "最終判断前に最新の制裁・規制・用途情報を再確認する",
  "案件記録・確認資料・承認フローを社内証跡として残す",
];

const futurePlan = [
  "導入相談時のレビュー体制と責任分界点の明文化",
  "必要に応じた専門家レビュー体制の整備と公開範囲の検討",
  "Beta版で得たフィードバックを反映した運用ガイドの拡充",
];

const reviewObjectives = [
  "誤解を招く表現を減らし、営業担当者が過信しない導線にする",
  "公開デモ・AI相談室・辞典・学習ページの説明責任を高める",
  "外為法・制裁・用途確認で重要な論点が抜けないよう設計を改善する",
];

export default function SupervisionPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Supervision & review</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            監修・レビュー体制
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            {APP_NAME} は、輸出管理の一次確認支援と、法令・規程の理解補助を目的とした Beta版サービスです。
            このページでは、現時点で公開しているレビュー体制と、まだ公開していない範囲を明確に示します。
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">Current state</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">現時点でのレビュー体制</h2>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-700">
              {currentReviewFlow.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 h-4 w-4 shrink-0 text-emerald-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="trade-hover-lift rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">Review objectives</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">レビューで重視していること</h2>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-700">
              {reviewObjectives.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 h-4 w-4 shrink-0 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand-navy/30">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </span>
            <div>
              <span className="trade-section-label">Current limits</span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">現時点で未公開・未提供の範囲</h2>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-700">
            {notYetPublished.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 h-4 w-4 shrink-0 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            Beta段階では、専門家氏名の掲示よりも先に、公開ページでの説明責任と誤利用防止の設計を優先しています。
            導入相談や正式運用の前提条件は、責任分界点とあわせて個別に整理する方針です。
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <section className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">Not yet published</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">本サービスが行わないこと</h2>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              本サービスは、法的助言・最終許認可判断・制裁照合の最終責任代行を提供するものではありません。
              公開ページ・AI相談室・デモの情報は、一次確認と理解支援の補助としてご利用ください。
            </div>
          </section>

          <section className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand-navy/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M18.75 18.75H4.875c-.621 0-1.125-.504-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">Recommended operation</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">実務利用時の推奨フロー</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {recommendedUse.map((item, index) => (
                <div key={item} className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy">
                    Step <span className="font-bold text-brand-navy">{index + 1}</span>
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-6 transition hover:border-brand-navy/30">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </span>
            <div>
              <span className="trade-section-label">Future plan</span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">今後の整備方針</h2>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm leading-7 text-slate-700">
            {futurePlan.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 h-4 w-4 shrink-0 text-brand-navy">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap gap-3">
            <Link href="/operator" className="trade-secondary-button">
              運営情報を見る
            </Link>
            <Link href="/evaluation-logic" className="trade-secondary-button">
              評価ロジックを見る
            </Link>
            <Link href="/contact" className="trade-primary-button">
              監修・導入について相談
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}