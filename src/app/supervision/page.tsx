import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `監修・レビュー体制 | ${APP_NAME}`,
  description:
    "Export Risk Navi のBeta版における監修・レビュー体制、未提供範囲、実務利用時の推奨運用を整理したページです。",
};

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
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Current state</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">現時点でのレビュー体制</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {currentReviewFlow.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Not yet published</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">現時点で未公開・未提供の範囲</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {notYetPublished.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              本サービスは、法的助言・最終許認可判断・制裁照合の最終責任代行を提供するものではありません。
              公開ページ・AI相談室・デモの情報は、一次確認と理解支援の補助としてご利用ください。
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Recommended operation</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">実務利用時の推奨フロー</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recommendedUse.map((item, index) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1e3a5f]">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Future plan</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">今後の整備方針</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
            {futurePlan.map((item) => (
              <li key={item}>- {item}</li>
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