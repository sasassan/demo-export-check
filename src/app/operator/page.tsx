import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `運営情報 | ${APP_NAME}`,
  description:
    "Export Risk Navi のBeta版における公開運営情報、開示方針、問い合わせ先、公開範囲を整理したページです。",
};

const publicFacts = [
  { label: "サービス名", value: APP_NAME },
  { label: "公開ステータス", value: "Beta版公開中" },
  { label: "公開主体の現状", value: "公開実証・改善中のBetaプロジェクト" },
  {
    label: "公開URL",
    value: "https://demo-export-check.vercel.app",
    href: "https://demo-export-check.vercel.app",
  },
  {
    label: "GitHubリポジトリ",
    value: "https://github.com/sasassan/demo-export-check",
    href: "https://github.com/sasassan/demo-export-check",
  },
  { label: "GitHubオーナー", value: "sasassan" },
  { label: "問い合わせ窓口", value: "お問い合わせフォーム", href: "/contact" },
];

const trustSignals = [
  "公開デモ、評価ロジック、セキュリティ方針、AIレビュー用概要を誰でも確認可能",
  "GitHub公開リポジトリで改善履歴と更新内容を追跡可能",
  "Beta版として、公開範囲と未公開範囲を分けて説明",
];

const developmentBackground = [
  "輸出管理部門を持たない企業でも、営業段階で最低限の確認を進められるようにしたいという課題意識を背景に設計しています。",
  "単なるAIチャットではなく、診断・辞典・AI相談室・学習ページを横断して、理解しながら実務を進められる構成を目指しています。",
  "現時点では個人名や法人詳細の全面公開よりも、公開デモ・評価ロジック・セキュリティ方針の説明責任を優先して整備しています。",
];

const disclosurePolicy = [
  "本Beta版では、サービス概要・公開デモ・AI相談室・辞典・学習・セキュリティ方針など、公開ページ上で確認できる情報を優先して開示しています。",
  "実顧客データ、ログイン後の案件一覧、案件ごとの内部判断記録、社内向けレポート詳細は一般公開していません。",
  "法人名、所在地、契約条件、NDA、SLA などの詳細条件は、正式版または個別導入相談の段階で整備・案内する前提です。",
];

const currentScope = [
  "トップページ、概要、デモ、AI相談室、辞典、学習、セキュリティ、研修支援、お問い合わせは誰でも閲覧可能",
  "ダッシュボード、案件登録、案件詳細、ケース別AI相談、PDF出力の一部はログイン前提",
  "公開デモはサンプルシナリオによるモック体験であり、実顧客情報は含まない",
];

const nextSteps = [
  "正式公開時の法定表記・事業情報の整理",
  "導入企業向けの契約条件、保存ポリシー、運用範囲の明確化",
  "セキュリティ説明、専用環境、NDA対応の詳細化",
];

export default function OperatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Operator information</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            運営情報
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            このページでは、{APP_NAME} のBeta版時点で公開している運営情報と、
            どの情報を公開範囲に含めているかを整理しています。
            BtoB向けサービスとして、公開情報と非公開情報の境界を明確にすることを目的としています。
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">現在公開している基本情報</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {publicFacts.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-2 block text-sm font-semibold text-[#1e3a5f] hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Why this is trustworthy</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">現時点で示している信頼材料</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Development background</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">開発背景と公開方針</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {developmentBackground.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700">
            Beta版のため、運営主体の詳細情報や契約条件などは導入相談時に追加開示する前提です。公開ページでは、まずプロダクトの説明責任と誤解防止の整備を優先しています。
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Disclosure policy</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">開示方針</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {disclosurePolicy.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Public scope</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">現時点の公開範囲</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {currentScope.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Beta roadmap</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">今後の整備予定</h2>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700">
            Beta版では「機能の実用性検証」と「公開ページでの説明責任強化」を並行して進めています。
            正式版または個別導入相談に向けて、以下の情報整備を優先します。
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
            {nextSteps.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">関連ページ</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/supervision" className="trade-secondary-button">
              監修・レビュー体制
            </Link>
            <Link href="/evaluation-logic" className="trade-secondary-button">
              評価ロジック
            </Link>
            <Link href="/security" className="trade-secondary-button">
              セキュリティ方針
            </Link>
            <Link href="/contact" className="trade-primary-button">
              導入について相談
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}