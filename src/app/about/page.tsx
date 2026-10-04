import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { LighthouseIcon, GlobeArrowIcon } from "@/components/icons/trade-icons";
import { WaveDivider } from "@/components/icons/trade-illustrations";
import { APP_NAME } from "@/lib/constants";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "サービス概要・特徴",
  description:
    "輸出リスクナビ（Export Risk Navi）は、該非判定・制裁リスト・キャッチオール規制・国リスク・用途・相手先企業の実在性をまとめて確認するAIベースの輸出管理支援サービスです。",
  path: "/about",
});

type FeaturePoint = {
  title: string;
  description: string;
  icon?: string;
  IconComponent?: typeof LighthouseIcon;
};

const servicePoints: FeaturePoint[] = [
  {
    title: "営業担当でも使いやすい",
    description: "商品名・型番・輸出先国・顧客企業名を入れるだけで、輸出管理の一次確認を始められます。",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
  },
  {
    title: "AIが論点を整理",
    description: "制裁・国リスク・用途・エンドユーザー確認など、判断に必要な論点を文章で要約します。",
    icon: "M10 2a.75.75 0 0 1 .75.75v1.043a6.252 6.252 0 0 1 5.457 5.457h1.043a.75.75 0 0 1 0 1.5h-1.043a6.252 6.252 0 0 1-5.457 5.457v1.043a.75.75 0 0 1-1.5 0v-1.043a6.252 6.252 0 0 1-5.457-5.457H2.75a.75.75 0 0 1 0-1.5h1.043a6.252 6.252 0 0 1 5.457-5.457V2.75A.75.75 0 0 1 10 2Zm0 3.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z",
  },
  {
    title: "国際取引を一元管理",
    description: "複数国への輸出案件や相手先企業の情報を一箇所にまとめ、グローバルな取引状況を見渡せます。",
    IconComponent: GlobeArrowIcon,
  },
  {
    title: "法令・規程の読解も補助",
    description: "ガイドライン、通達、社内規程、長文PDFの要点整理や言い換えを通じて、新任担当者の理解を支援します。",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
];

const useCases = [
  "初めて輸出する顧客の一次確認",
  "高リスク国向けの事前スクリーニング",
  "営業から法務・輸出管理への引き継ぎ",
  "決裁前の簡易リスク整理",
];

const trustPoints: FeaturePoint[] = [
  {
    title: "公開デモとサンプルシナリオを用意",
    description:
      "公開ページでも、入力→論点整理→結果確認の流れを追えるようにサンプルシナリオベースのデモを提供しています。",
    IconComponent: LighthouseIcon,
  },
  {
    title: "公開範囲を明示",
    description:
      "公開ページとログイン後ページを分け、実顧客情報・案件一覧・内部レポートは一般公開しない方針です。",
    icon: "M12 15v2.25m-6.44-1.94-1.94 1.94M3.75 12H6m8.44-6.44 1.94-1.94M20.25 12H18M12 6.44V3.75M6.44 5.06 4.5 3.12M17.56 5.06l1.94-1.94M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z",
  },
  {
    title: "法令・規程の読解支援を重視",
    description:
      "AI相談室では、条文の意味、社内規程、長文PDFの要点整理など、実務理解に寄与する使い方を重視しています。",
    icon: "M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.984c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 outline-none">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="trade-section-label">サービス概要</span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{APP_NAME} とは？</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {APP_NAME} は、輸出案件の一次確認をスピーディに進めるための、AIベースの輸出リスク確認サービスです。
                該非判定、制裁リスト、キャッチオール規制、国リスク、用途、相手先企業の実在性などをまとめて確認し、
                営業・輸出管理・法務が共通の判断材料を持てるようにします。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/demo" data-cta-id="about-demo" data-cta-label="デモを見る" data-cta-target="/demo" className="trade-primary-button">デモを見る</Link>
                <Link href="/?v=about" data-cta-id="about-home" data-cta-label="トップページに戻る" data-cta-target="/?v=about" className="trade-secondary-button">トップページに戻る</Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <Image src="/trade-hero.webp" alt="輸出リスクナビの該非判定・制裁・用途・国リスクの一次確認フローを示す図" width={1792} height={1024} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full object-cover" priority />
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {servicePoints.map((item) => (
            <div key={item.title} className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                {item.IconComponent ? (
                  <item.IconComponent aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                )}
              </span>
              <h2 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <WaveDivider aria-hidden="true" className="h-3 w-full text-brand-navy/15" />

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6">
          <span className="trade-section-label">ナレッジアシスタント</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">判定AIだけでなく、理解を助けるAIへ</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="trade-hover-lift rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
              <p className="text-sm font-semibold text-slate-900">読解支援でできること</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "法令・通達・ガイドラインの要約",
                  "条文の意味を現場向けに言い換え",
                  "自社輸出に関係ある箇所の抽出",
                  "次に確認すべき点の整理",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="trade-hover-lift rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
              <p className="text-sm font-semibold text-slate-900">想定ユーザー</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {[
                  "初めて輸出管理を担当する営業担当者",
                  "社内規程整備を任された実務担当者",
                  "法令資料を読み解きたい管理部門",
                  "判断前に論点整理したい上長・責任者",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">信頼性について</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">公開ページで伝えている信頼ポイント</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {trustPoints.map((item) => (
              <div key={item.title} className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                  {item.IconComponent ? (
                    <item.IconComponent aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  )}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">現在の制限</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">現時点での公開上の制限</h2>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
            実顧客データを含む案件一覧、社内向けの調査履歴、実運用のPDFレポート詳細は一般公開していません。
            公開デモでは、機密情報を含まないサンプルシナリオで操作イメージを確認できる構成にしています。
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">詳細情報</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">詳細ページ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              {
                href: "/operator",
                title: "運営情報",
                text: "公開している運営情報、公開範囲、問い合わせ導線を整理しています。",
                icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21",
              },
              {
                href: "/supervision",
                title: "監修・レビュー体制",
                text: "現時点で公開しているレビュー体制と、まだ未公開・未提供の範囲を明示しています。",
                icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
              },
              {
                href: "/evaluation-logic",
                title: "評価ロジック",
                text: "A/B/C判定の考え方、8観点、総合評価の集約方法を説明しています。",
                icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25",
              },
            ].map((item) => (
              <div key={item.href} className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:border-brand-navy/30">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                <Link
                  href={item.href}
                  data-cta-id={`about-detail-${item.href.replace(/\//g, "-")}`}
                  data-cta-label={`${item.title} 詳細を見る`}
                  data-cta-target={item.href}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-navy hover:underline"
                >
                  詳細を見る
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">このサービスでできること</h2>
            <div className="mt-4 space-y-2">
              {["AI入力診断で、登録前に不足情報を把握", "制裁・国・用途・企業信用をまとめて調査", "AIが次に確認すべきアクションを提案", "チェックリストで確認漏れを防止", "PDFレポートをすぐに出力", "案件一覧で検索・絞り込み・並び替え"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-500">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">推奨シーン</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">こんな場面で役立ちます</h2>
            <ul className="mt-4 space-y-2">
              {useCases.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-navy" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">まず何を見ればいい？</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">まずはトップページで概要を確認し、ログイン後に案件登録からAI診断までを試すのがおすすめです。</p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact?v=about" data-cta-id="about-contact" data-cta-label="導入について相談" data-cta-target="/contact?v=about" className="trade-primary-button">導入について相談</Link>
              <Link href="/?v=about" data-cta-id="about-home-bottom" data-cta-label="トップページを見る" data-cta-target="/?v=about" className="trade-secondary-button">トップページを見る</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
