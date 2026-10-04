import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "運営情報",
  description:
    "輸出リスクナビ（Export Risk Navi）の公開運営情報、開示方針、問い合わせ先、公開範囲を整理したページです。",
  path: "/operator",
});

const publicFacts = [
  {
    label: "サービス名",
    value: APP_NAME,
    icon: "M21 7.5V18a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18V7.5m18 0A2.25 2.25 0 0 0 18.75 5.25H5.25A2.25 2.25 0 0 0 3 7.5m18 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.07 9.66A2.25 2.25 0 0 1 2 7.743V7.5",
  },
  {
    label: "公開ステータス",
    value: "正式公開中",
    icon: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  },
  {
    label: "公開主体の現状",
    value: "公開・継続改善中のプロジェクト",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z",
  },
  {
    label: "公開URL",
    value: "https://demo-export-check.vercel.app",
    href: "https://demo-export-check.vercel.app",
    icon: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
  },
  {
    label: "GitHubリポジトリ",
    value: "https://github.com/sasassan/demo-export-check",
    href: "https://github.com/sasassan/demo-export-check",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  },
  {
    label: "GitHubオーナー",
    value: "sasassan",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    label: "問い合わせ窓口",
    value: "お問い合わせフォーム",
    href: "/contact",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.07 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  },
];

const trustSignals = [
  {
    text: "公開デモ、評価ロジック、セキュリティ方針、AIレビュー用概要を誰でも確認可能",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
  },
  {
    text: "GitHub公開リポジトリで改善履歴と更新内容を追跡可能",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  },
  {
    text: "公開範囲と未公開範囲を分けて説明",
    icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
  },
];

const developmentBackground = [
  {
    text: "輸出管理部門を持たない企業でも、営業段階で最低限の確認を進められるようにしたいという課題意識を背景に設計しています。",
    icon: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
  {
    text: "単なるAIチャットではなく、診断・辞典・AI相談室・学習ページを横断して、理解しながら実務を進められる構成を目指しています。",
    icon: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3",
  },
  {
    text: "現時点では個人名や法人詳細の全面公開よりも、公開デモ・評価ロジック・セキュリティ方針の説明責任を優先して整備しています。",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
  },
];

const disclosurePolicy = [
  "本サービスでは、サービス概要・公開デモ・AI相談室・辞典・学習・セキュリティ方針など、公開ページ上で確認できる情報を優先して開示しています。",
  "実顧客データ、ログイン後の案件一覧、案件ごとの内部判断記録、社内向けレポート詳細は一般公開していません。",
  "法人名、所在地、契約条件、NDA、SLA などの詳細条件は、個別導入相談の段階で整備・案内する前提です。",
];

const currentScope = [
  "トップページ、概要、デモ、AI相談室、辞典、学習、セキュリティ、研修支援、お問い合わせは誰でも閲覧可能",
  "ダッシュボード、案件登録、案件詳細、ケース別AI相談、PDF出力の一部はログイン前提",
  "公開デモはサンプルシナリオによるモック体験であり、実顧客情報は含まない",
];

const nextSteps = [
  "法定表記・事業情報の継続的な整理",
  "導入企業向けの契約条件、保存ポリシー、運用範囲の明確化",
  "セキュリティ説明、専用環境、NDA対応の詳細化",
];

export default function OperatorPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 outline-none">
        <section className="rounded-xl border border-slate-200 bg-panel p-6 sm:p-8">
          <span className="trade-section-label">Operator information</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            運営情報
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            このページでは、{APP_NAME} の現時点で公開している運営情報と、
            どの情報を公開範囲に含めているかを整理しています。
            BtoB向けサービスとして、公開情報と非公開情報の境界を明確にすることを目的としています。
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-panel p-6">
          <h2 className="text-xl font-bold text-slate-900">現在公開している基本情報</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {publicFacts.map((item) => (
              <div key={item.label} className="trade-hover-lift flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-brand-navy/30">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tint-blue text-brand-navy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 block text-sm font-semibold text-brand-navy hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {item.label === "公開ステータス" ? (
                        <span className="font-bold text-brand-navy">{item.value}</span>
                      ) : (
                        item.value
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-tint-blue/60 to-panel p-6">
          <span className="trade-section-label">Why this is trustworthy</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">現時点で示している信頼材料</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {trustSignals.map((item) => (
              <div key={item.text} className="trade-hover-lift rounded-lg border border-slate-200 bg-panel p-5 text-sm leading-7 text-slate-700 transition hover:border-brand-navy/30">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tint-blue text-brand-navy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <p className="mt-3">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-panel p-6">
          <span className="trade-section-label">Development background</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">開発背景と公開方針</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {developmentBackground.map((item) => (
              <div key={item.text} className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 transition hover:border-brand-navy/30">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tint-blue text-brand-navy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <p className="mt-3">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-tint-blue-bright bg-tint-blue p-4 text-sm leading-7 text-slate-700">
            運営主体の詳細情報や契約条件などは導入相談時に追加開示する前提です。公開ページでは、まずプロダクトの説明責任と誤解防止の整備を優先しています。
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-panel p-6">
            <span className="trade-section-label">Disclosure policy</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">開示方針</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {disclosurePolicy.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-4 w-4 shrink-0 text-brand-navy">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-panel p-6">
            <span className="trade-section-label">Public scope</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">現時点の公開範囲</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {currentScope.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-4 w-4 shrink-0 text-brand-navy">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-tint-blue/60 to-panel p-6">
          <span className="trade-section-label">Roadmap</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">今後の整備予定</h2>
          <div className="mt-4 rounded-lg border border-tint-blue-bright bg-tint-blue p-4 text-sm leading-7 text-slate-700">
            「機能の実用性検証」と「公開ページでの説明責任強化」を並行して進めています。
            個別導入相談に向けて、以下の情報整備を優先します。
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
            {nextSteps.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-4 w-4 shrink-0 text-emerald-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-panel p-6">
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