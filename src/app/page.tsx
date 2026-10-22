import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { buildSeo, SITE_URL } from "@/lib/seo";
import { PortTerminalScene, TradeRouteMap } from "@/components/icons/port-scene";
import { WorldMapPattern } from "@/components/icons/trade-illustrations";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "輸出管理のAI一次確認・該非判定支援",
  description:
    "輸出管理の一次確認に必要な論点をAIが整理。公開デモでは評価例と追加確認事項を確認できます。実際の該非判定・制裁照合・輸出許可判断は別途確認が必要です。",
  path: "/",
});

const features = [
  {
    title: "制裁リスト調査",
    description: "制裁リスト照合で確認すべき対象と根拠を整理します。実際の照合範囲・更新日時を確認してください。",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
    tint: "bg-tint-blue text-brand-navy",
  },
  {
    title: "エンドユーザー実在性確認",
    description: "輸出先企業の実在性・所在地・同名企業の区別など、追加調査の論点を整理します。",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
    tint: "bg-tint-teal text-brand-teal",
  },
  {
    title: "UBO / PEPs確認",
    description: "実質的支配者（UBO）やPEPsの調査は今後の拡充項目です。現在の一次確認だけで照合済みとは扱いません。",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
    tint: "bg-tint-violet text-violet-400",
  },
  {
    title: "国リスク評価",
    description: "輸出先国の制裁・規制・情勢について、確認が必要な事項を整理します。",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418",
    tint: "bg-tint-sky text-sky-400",
  },
  {
    title: "用途リスク / キャッチオール規制",
    description: "最終用途・最終需要者・軍事転用懸念などの確認論点を提示します。情報不足時は追加確認が必要です。",
    icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
    tint: "bg-tint-amber text-amber-400",
  },
  {
    title: "PDFレポート出力",
    description: "調査結果・評価理由・根拠資料をA4形式でまとめ、上司提出・社内決裁に使えるレポートを生成します。",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
    tint: "bg-tint-emerald text-brand-emerald",
  },
];

const steps = [
  { number: "01", title: "案件情報を入力", description: "商品名・型番・輸出先国・顧客企業名から一次確認を開始。法令上の最終判断には専門家の確認が必要です。" },
  { number: "02", title: "AIが一次スクリーニングを支援", description: "入力情報と公開情報をもとに、制裁・企業・国別リスクなど8つの観点で評価を支援します。" },
  { number: "03", title: "評価とレポートを確認", description: "A/B/C評価と根拠をわかりやすく表示。PDFレポートもワンクリックで出力できます。" },
];

const roadmap = [
  { phase: "Phase 1", status: "開発中", title: "輸出管理AI一次確認", items: ["A/B/C評価", "PDFレポート出力", "一次スクリーニング支援"], active: true },
  { phase: "Phase 2", status: "計画中", title: "企業・人物調査", items: ["企業情報調査", "UBO（実質支配者）確認", "制裁リスク詳細分析"], active: false },
  { phase: "Phase 3", status: "構想中", title: "高度なAI解析", items: ["商品画像解析", "戦場・ニュース類似調査", "AI市場調査"], active: false },
];

const quickLinks = [
  {
    href: "/demo",
    label: "デモ画面",
    desc: "実際の診断フローを体験",
    icon: "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.971l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z",
    tint: "bg-tint-blue text-brand-navy",
  },
  {
    href: "/glossary",
    label: "輸出辞典",
    desc: "専門用語を検索・解説",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
    tint: "bg-tint-teal text-brand-teal",
  },
  {
    href: "/ai-room",
    label: "AI相談室",
    desc: "規制資料の読み方を相談",
    icon: "M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z",
    tint: "bg-tint-violet text-violet-400",
  },
  {
    href: "/learning",
    label: "学習コンテンツ",
    desc: "失敗例・注意事項を確認",
    icon: "M12 14.25c-4.142 0-7.5-1.5-7.5-1.5v6c0 .621 3.358 1.5 7.5 1.5s7.5-.879 7.5-1.5v-6s-3.358 1.5-7.5 1.5Zm0-9L4.5 8.25 12 12.75l7.5-4.5L12 3.75Z",
    tint: "bg-tint-amber text-amber-400",
  },
  {
    href: "/security",
    label: "セキュリティ",
    desc: "AI入力ガイドライン",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
    tint: "bg-tint-emerald text-brand-emerald",
  },
  {
    href: "/training",
    label: "研修支援",
    desc: "営業教育・社内ルール整備",
    icon: "M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    tint: "bg-tint-rose text-rose-400",
  },
];

const trustSignals = [
  {
    title: "公開デモあり",
    body: "入力→結果確認の流れをサンプルシナリオで体験できます。",
    href: "/demo",
  },
  {
    title: "評価ロジック公開",
    body: "A/B/C判定の考え方、8観点、集約方法を公開しています。",
    href: "/evaluation-logic",
  },
  {
    title: "運営・公開方針を明示",
    body: "公開範囲、レビュー体制、セキュリティ方針を分けて説明しています。",
    href: "/operator",
  },
];

const roiHighlights = [
  {
    label: "従来の確認時間",
    value: "約90分",
    note: "情報収集、確認漏れ洗い出し、上司相談までを都度手作業",
  },
  {
    label: "一次確認の目安",
    value: "約5分",
    note: "営業担当が商談前に論点整理できる状態を目指す",
  },
  {
    label: "年間500件の想定",
    value: "約700時間削減",
    note: "85分短縮 × 500件で試算した参考値",
  },
  {
    label: "導入効果の見せ方",
    value: "人件費換算しやすい",
    note: "稟議では時間削減・確認漏れ防止・引き継ぎ効率で説明しやすい",
  },
];

const uspPoints = [
  {
    title: "AIチャットではなく、輸出管理の一次確認導線",
    body: "価値はAIを使うことではなく、輸出管理の専門知識がなくても営業担当者が初動確認を進められることです。",
  },
  {
    title: "診断・辞典・AI相談室がつながっている",
    body: "用語が分からない、条文の意味が難しい、確認ポイントを整理したい、という現場の流れを1つのサイト内で回せます。",
  },
  {
    title: "商談前の5分確認を設計している",
    body: "上司・法務・輸出管理に回す前の一次確認を、営業側で短時間に論点整理できることを重視しています。",
  },
];

const targetProfiles = [
  {
    title: "輸出管理部門がない企業",
    body: "専任部門がなく、営業や管理部門が初動確認を担っている会社向け。",
  },
  {
    title: "海外営業担当",
    body: "商談前に最低限の確認ポイントを整理し、社内相談をスムーズにしたい担当者向け。",
  },
  {
    title: "初めて海外取引を行う中小製造業",
    body: "輸出管理の土地勘が薄く、何を見ればよいか分からない企業向け。",
  },
  {
    title: "社内規程を整備したい担当者",
    body: "規程・条文・社内フローの理解を深めながら運用設計したい実務担当者向け。",
  },
];

const faqItems = [
  {
    q: "該非判定（がいひはんてい）とは何ですか？",
    a: "輸出しようとする貨物・技術が、輸出貿易管理令などの規制対象に該当するか非該当かを判定する作業です。該当する場合は経済産業大臣の輸出許可が必要になるため、輸出前の確認が欠かせません。",
  },
  {
    q: "キャッチオール規制とはどのような規制ですか？",
    a: "リスト規制に該当しない貨物・技術でも、大量破壊兵器や通常兵器の開発等に用いられるおそれがある場合に輸出許可を義務付ける規制です。用途・需要者・最終用途の確認が重要になります。",
  },
  {
    q: "輸出管理の一次確認は何から始めればよいですか？",
    a: "商品（型番・スペック）、輸出先国、相手企業、用途の4点を順に確認するのが基本です。本サービスでは、この一次確認に必要な論点をAIが整理し、確認漏れを防ぎます。",
  },
  {
    q: "専門知識がなくても利用できますか？",
    a: "はい。商品名・型番・輸出先国・顧客企業名を入力するだけで、制裁・用途・国リスクなどの観点から一次スクリーニングを支援します。判定根拠と確認アクションを日本語で提示します。",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: APP_NAME,
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ja-JP",
  description:
    "輸出リスク・該非判定・キャッチオール規制まで、輸出管理の一次確認をAIが支援する中小企業向けWebアプリ。公開デモで一次確認の流れを体験でき、AI相談室で規制資料や社内規程の読解支援も行う。",
  audience: {
    "@type": "Audience",
    audienceType: "営業担当者、輸出管理担当者、管理部門",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <div className="min-h-screen bg-panel">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [jsonLd, faqJsonLd],
          }).replace(/</g, "\\u003c"),
        }}
      />
      {/* ナビゲーション */}
      <nav aria-label="メインナビゲーション" className="sticky top-0 z-50 border-b border-slate-200/80 bg-panel/90 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-deep">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/about?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">概要</Link>
            <Link href="/glossary?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">辞典</Link>
            <Link href="/ai-room?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900">AI相談室</Link>
            <Link href="/demo?v=lp-nav" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 md:inline-flex">デモ</Link>
            <span className="mx-1 hidden h-5 w-px bg-slate-200 md:block" />
            <Link href="/contact?v=lp-nav" className="rounded-md bg-brand-deep px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-brand-deep-light">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* ヒーロー: 調査範囲と次のアクションを優先したBtoB向け構成 */}
        <section aria-labelledby="hero-title" className="border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
            <div>
              <p className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy">
                海外営業・輸出管理担当者向け｜公開デモ
              </p>
              <h1 id="hero-title" className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                輸出管理の一次確認を、
                <span className="block text-brand-navy">わかりやすく、確実な次の一歩へ。</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700">
                商品・仕向地・取引先の情報から、確認すべき論点を整理。
                調査結果だけでなく、未確認事項と追加確認のアクションを明確にします。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo?v=hero" data-cta-id="hero-demo" data-cta-label="公開デモを試す" data-cta-target="/demo?v=hero" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand-deep px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-deep-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy">
                  公開デモを試す <span aria-hidden="true" className="ml-2">→</span>
                </Link>
                <Link href="/evaluation-logic" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand-navy hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy">
                  評価の仕組みを見る
                </Link>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600">
                本サービスは輸出管理の一次確認支援です。法令上の該非判定、制裁対象との確定照合、輸出許可・取引承認を保証するものではありません。
              </p>
              <div className="mt-7 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3">
                {[
                  ["01", "情報を入力"],
                  ["02", "確認事項を整理"],
                  ["03", "根拠と未確認事項を確認"],
                ].map(([number, label]) => (
                  <div key={number} className="flex items-start gap-2">
                    <span className="font-mono text-xs font-bold text-brand-navy">{number}</span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div aria-label="診断結果のサンプル表示" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">ASSESSMENT PREVIEW</p>
                  <h2 className="mt-1 text-base font-bold text-slate-900">一次確認レポート</h2>
                </div>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">サンプル・実際の照合結果ではありません</span>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">商品</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">産業用サーボモーター（架空例）</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">仕向地</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">ベトナム（例示）</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <span aria-hidden="true" className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-sm font-bold text-amber-950">要追加確認</p>
                    <p className="mt-1 text-sm leading-6 text-amber-900">最終需要者と用途の裏付けが不足しています。取引可否の判断は保留してください。</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">確認状況（表示例）</h3>
                  <div className="mt-3 space-y-2">
                    {[
                      ["商品情報", "入力済み", "text-slate-700 bg-slate-100"],
                      ["最終用途", "未確認", "text-amber-900 bg-amber-100"],
                      ["制裁リスト照合", "未実施", "text-slate-700 bg-slate-100"],
                    ].map(([label, status, style]) => (
                      <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                        <span className="text-sm text-slate-800">{label}</span>
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${style}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
                  未確認は「問題なし」を意味しません。実際の診断では根拠・対象・確認日時を確認してください。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* クイックリンク */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-tint-blue/50 px-4 py-5 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group trade-hover-lift flex items-start gap-3 rounded-xl border border-slate-200 bg-panel px-4 py-3.5 transition hover:border-brand-navy/40"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.tint}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-navy">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-4 text-slate-600">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 港湾シーン（モック風コンソールビュー） */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-panel to-slate-50/60 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="trade-section-label">PORT OPERATIONS</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">港湾のいま</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  輸出の起点は港から。航路・コンテナ・通関の全体像を、貿易コンソールのビジュアルで表現しています。
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[10px] font-bold tracking-widest text-brand-navy">
                <span className="live-dot" />
                コンソールビュー
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-panel shadow-2xl shadow-black/40">
              <PortTerminalScene aria-hidden="true" className="block h-44 w-full sm:h-56 lg:h-64" idPrefix="hero-port" />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-600">コンテナターミナル・コンソールビュー</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-600">クレーン・コンテナ船・ヤード（イメージ）</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-tint-blue/40 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl space-y-12">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">
                導入効果と対象ユーザー
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                何が変わるのか、誰のためのサービスかを明確に
              </h2>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">導入効果の目安</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {roiHighlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-panel p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-brand-navy">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-600">
                上記は公開版の参考試算です。実際の削減時間は案件難易度、社内承認フロー、確認対象の広さによって変動します。
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
                <span className="trade-section-label">USP</span>
                <h3 className="mt-3 text-xl font-bold text-slate-900">競争力の中心は「AIであること」ではありません</h3>
                <div className="mt-4 space-y-3">
                  {uspPoints.map((item) => (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
                <span className="trade-section-label">対象ユーザー</span>
                <h3 className="mt-3 text-xl font-bold text-slate-900">特に想定している利用者</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {targetProfiles.map((item) => (
                    <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3ステップ */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-panel px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">3ステップで完了</h2>
            <p className="mt-2 text-base text-slate-600">専門知識不要。商品情報を入力するだけで一次確認の論点を整理できます。</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-deep text-sm font-bold !text-white">{step.number}</div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 診断レポートサンプル */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">
                診断レポートサンプル
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">入力したら何が出るのか</h2>
              <p className="mt-2 text-base text-slate-600">診断結果はこのように表示されます。A4レポートとしてPDF出力も可能です。</p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-navy">診断レポート - 1ページ目</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">高精度サーボモーター SRV-9800 → ベトナム</p>
                  </div>
                  <span className="rounded-md bg-tint-amber-strong px-2.5 py-1 text-sm font-bold text-amber-300">B</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "制裁リスト", score: "95", grade: "A", bg: "bg-tint-emerald", border: "border-tint-emerald-border", text: "text-emerald-400" },
                    { label: "企業信用", score: "72", grade: "B", bg: "bg-tint-amber", border: "border-tint-amber-border", text: "text-amber-300" },
                    { label: "国リスク", score: "68", grade: "B", bg: "bg-tint-amber", border: "border-tint-amber-border", text: "text-amber-300" },
                    { label: "用途", score: "88", grade: "A", bg: "bg-tint-emerald", border: "border-tint-emerald-border", text: "text-emerald-400" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border p-2 ${item.bg} ${item.border}`}>
                      <p className="text-[10px] text-slate-600">{item.label}</p>
                      <p className={`mt-0.5 text-lg font-bold ${item.text}`}>{item.grade}</p>
                      <p className="text-[10px] text-slate-600">{item.score}点</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-800">総合リスク概要</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">ベトナムは中程度の国リスク。企業の登記情報は確認済みだが、類似名称企業の存在を確認する必要あり。用途は産業機械として適切。</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-navy">診断レポート - 2ページ目</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">判定理由・確認ポイント・推奨対応</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-tint-amber-border bg-tint-amber p-3">
                    <p className="text-xs font-bold text-amber-300">要確認：企業信用</p>
                    <p className="mt-1 text-xs text-amber-300">類似名称の別企業が同地域に存在。商標登記番号または法人番号を取引先に確認してください。</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-800">推奨アクション</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      <li>- 取引先の法人登記証明書を入手</li>
                      <li>- 最終用途証明書（EUC）を取得</li>
                      <li>- 社内輸出管理担当者へ連携</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-800">社内共有</p>
                    <p className="mt-1 text-xs text-slate-700">レポートを上司・法務へ共有し、判断根拠を揃えて決裁に進められます。</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/demo?v=report-sample" className="inline-flex items-center gap-2 rounded-lg bg-brand-deep px-5 py-2.5 text-sm font-semibold !text-white shadow-sm hover:bg-brand-deep-light">
                実際のデモを見る
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 判定根拠セクション */}
        <section className="border-b border-slate-100 bg-brand-deep px-4 py-16 text-white sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-50">判定の根拠</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">何をもとに判定しているのか</h2>
              <p className="mt-2 text-base text-blue-50">AIが一次スクリーニングに使用する情報源を公開しています。</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "国際制裁情報", desc: "国連・米国OFAC・EU・英国HMTなどの制裁リスト" },
                { label: "輸出規制情報", desc: "日本の外為法・EAR（米国輸出管理規則）などの規制情報" },
                { label: "企業公開情報", desc: "企業登記・所在地・事業内容などの公開データ" },
                { label: "国リスク情報", desc: "政情・紛争・地政学リスクに関する公開情報" },
                { label: "用途リスク情報", desc: "軍事転用・大量破壊兵器関連用途に関する分類情報" },
              ].map((src) => (
                <div key={src.label} className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">{src.label}</p>
                  <p className="mt-1 text-sm text-blue-50">{src.desc}</p>
                </div>
              ))}
              <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                <p className="text-sm font-semibold text-white">一次確認の位置づけ</p>
                <p className="mt-1 text-sm text-blue-50">専門家の判断を補助するツールとして、確認の抜け漏れと論点整理を支援します。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-tint-blue/30 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">
                信頼性と公開方針
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                公開版で明示していること
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "公開デモはサンプルシナリオ方式",
                  text: "実顧客情報は公開せず、入力〜結果確認の流れをサンプル条件で体験できる構成にしています。",
                },
                {
                  title: "最新情報の再確認が前提",
                  text: "制裁・規制・国リスクは変動するため、最終判断前に最新情報を確認する運用を前提としています。",
                },
                {
                  title: "専門家の判断と併用する前提",
                  text: "一次確認・論点整理・理解支援を目的とし、社内承認や専門家判断と組み合わせてご利用いただく設計です。",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-panel p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI診断機能 */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-panel px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">AI診断機能</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">AIが案件の危険信号を解説</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">単にA/B/Cを返すだけでなく、なぜその評価になったか、営業担当が次に何を確認すべきかを、わかりやすい日本語で提示します。</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "AIリスク診断", text: "案件情報から重要な確認漏れを抽出し、優先順位付きで案内します。" },
                  { title: "確認アクション提案", text: "顧客へ聞くべき項目や回収すべき資料を即時に表示します。" },
                  { title: "エビデンス要約", text: "根拠ソースを一行で把握できるので、社内共有がスムーズです。" },
                  { title: "決裁向けレポート", text: "調査サマリーと次アクションをそのままPDF化して提出できます。" },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-panel p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">サービスについて</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">誰が、なぜ作っているのか</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">輸出管理・海外業務の実務経験を背景に、「中小企業の営業担当者でも一次確認ができる」ツールを目指して開発しています。</p>
                <p className="mt-2 text-base leading-7 text-slate-600">大企業には専任の輸出管理部門があります。しかし中小企業の現場では、営業担当者が輸出コンプライアンスの初動判断を迫られることが多くあります。</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: "輸出管理部門がなくても使える", desc: "専門知識不要。商品と取引先の基本情報を入力するだけで一次確認を進められます。", border: "border-l-brand-navy" },
                  { title: "営業担当者が商談前に確認できる", desc: "5分で完了するスクリーニングで、商談前のリスク把握が可能です。", border: "border-l-[#2dd4bf]" },
                  { title: "判断根拠を可視化して共有", desc: "評価理由と根拠をPDFで出力し、上司・法務担当へスムーズに連携できます。", border: "border-l-[#38bdf8]" },
                ].map((item) => (
                  <div key={item.title} className={`rounded-lg border border-slate-200 border-l-4 ${item.border} bg-panel p-4 shadow-sm`}>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 機能カード */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">8つの観点で一次スクリーニングを支援</h2>
              <p className="mt-2 text-base text-slate-600">従来は属人的だった一次確認の論点整理を、AIが短時間で支援します。</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="trade-hover-lift rounded-xl border border-slate-200 bg-panel p-5 shadow-sm">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.tint}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金 */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">料金プラン</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">シンプルな料金体系</h2>
              <p className="mt-2 text-base text-slate-600">無料プランでご利用いただけます。追加プランの料金は準備中です。</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="relative rounded-xl border-2 border-brand-navy bg-panel p-7 shadow-sm">
                <span className="absolute -top-3 left-5 rounded-full bg-brand-deep px-3 py-0.5 text-xs font-bold !text-white">現在公開中</span>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-navy">無料プラン</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">無料</p>
                <p className="mt-1 text-sm text-slate-600">現在、全機能を無料でご利用いただけます</p>
                <ul className="mt-5 space-y-2.5">
                  {["AI一次スクリーニング（8観点）", "A/B/C評価 + 判定理由表示", "PDFレポート出力", "案件管理（段階的に機能拡充）"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-800">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-brand-navy"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/demo?v=pricing" className="mt-6 flex w-full items-center justify-center rounded-lg bg-brand-deep py-2.5 text-sm font-semibold !text-white shadow-sm hover:bg-brand-deep-light">デモで試す</Link>
              </div>
              <div className="rounded-xl border border-slate-200 bg-panel p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">追加プラン（準備中）</p>
                <p className="mt-2 text-3xl font-bold text-slate-500">未定</p>
                <p className="mt-1 text-sm text-slate-600">月額料金・プランは検討中です</p>
                <ul className="mt-5 space-y-2.5">
                  {["無料プランの全機能", "企業情報・UBO詳細調査", "制裁リストリアルタイム照合", "チーム共有・管理機能", "API連携（開発者向け）"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contact?v=pricing" className="mt-6 flex w-full items-center justify-center rounded-lg border border-slate-300 bg-panel py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">リリース通知を受け取る</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Training */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-tint-blue/40 px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-2.5 py-1 text-[10px] font-semibold tracking-wider text-brand-navy">信頼とセキュリティ</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">AI入力の不安に先回りして対応</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">図面・仕様書をAIへ入力してよいか、技術提供に該当しないか。企業導入でよく出る懸念を整理したガイドラインを用意しています。</p>
              <div className="mt-4 flex gap-3">
                <Link href="/security?v=lp" data-cta-id="trust-security" data-cta-label="セキュリティ方針" data-cta-target="/security?v=lp" className="rounded-md bg-brand-deep px-4 py-2 text-sm font-semibold !text-white hover:bg-brand-deep-light">セキュリティ方針</Link>
                <Link href="/ai-room?v=lp-security" data-cta-id="trust-ai-room" data-cta-label="AI相談室で確認" data-cta-target="/ai-room?v=lp-security" className="rounded-md border border-slate-300 bg-panel px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">AI相談室で確認</Link>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-2.5 py-1 text-[10px] font-semibold tracking-wider text-brand-navy">研修サービス</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">AI導入だけでなく、運用教育まで支援</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">営業担当向け教育、外為法セミナー、法令改正時の定期講習、社内ルール策定支援など。</p>
              <div className="mt-4 flex gap-3">
                <Link href="/training?v=lp" data-cta-id="training-service" data-cta-label="研修サービス" data-cta-target="/training?v=lp" className="rounded-md bg-brand-deep px-4 py-2 text-sm font-semibold !text-white hover:bg-brand-deep-light">研修サービス</Link>
                <Link href="/contact?v=lp-training" data-cta-id="training-contact" data-cta-label="導入相談" data-cta-target="/contact?v=lp-training" className="rounded-md border border-slate-300 bg-panel px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">導入相談</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ロードマップ */}
        <section className="border-b border-slate-100 bg-brand-deep px-4 py-16 text-white sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-50">ロードマップ</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">中小企業向け輸出リスク判断支援プラットフォームへ</h2>
              <p className="mt-2 text-base text-blue-50">単なるAIチャットではなく、輸出コンプライアンスの実務を支援するプラットフォームを目指しています。</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {roadmap.map((phase) => (
                <div key={phase.phase} className={`rounded-lg border p-5 ${phase.active ? "border-white/20 bg-white/15" : "border-white/10 bg-white/5"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-100">{phase.phase}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${phase.active ? "bg-white/20 text-white" : "bg-white/10 text-blue-100"}`}>{phase.status}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold">{phase.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-blue-50">
                        <span className="h-1 w-1 rounded-full bg-blue-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* よくある質問 */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-tint-blue-bright bg-tint-blue px-3 py-1 text-[11px] font-semibold tracking-wider text-brand-navy">よくある質問</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">該非判定・輸出管理でよくある質問</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="rounded-xl border border-slate-200 bg-panel p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep via-brand-deep to-blue-800 p-10 text-center shadow-2xl shadow-brand-cyan/20">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">まずは1件、試してみてください</h2>
              <p className="mt-2 text-base text-blue-50">無料でご利用いただけます。メールアドレスだけで開始できます。登録後すぐに案件確認フローを試せます。</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/demo?v=cta" data-cta-id="footer-demo" data-cta-label="デモを見る" data-cta-target="/demo?v=cta" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">デモを見る</Link>
                <Link href="/contact?v=cta" data-cta-id="footer-contact" data-cta-label="導入について相談する" data-cta-target="/contact?v=cta" className="rounded-lg bg-panel px-6 py-3 text-sm font-semibold text-brand-navy shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">導入について相談する</Link>
                <Link href="/contact?v=cta-fb" data-cta-id="footer-feedback" data-cta-label="フィードバックを送る" data-cta-target="/contact?v=cta-fb" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20">フィードバックを送る</Link>
              </div>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-panel px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-deep">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-3.5 w-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
                    </svg>
                  </div>
                  <span className="text-base font-bold text-slate-900">{APP_NAME}</span>
                </div>
                <p className="mt-4 max-w-sm text-xs leading-6 text-slate-500">
                  本サービスは輸出管理における専門家の判断を補助するツールです。ご利用にあたっては
                  <Link href="/terms" className="font-semibold text-brand-navy hover:underline">利用規約</Link>
                  に同意の上ご利用ください。
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">サービス</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li><Link href="/operator" className="transition hover:text-brand-navy hover:underline">運営情報</Link></li>
                  <li><Link href="/supervision" className="transition hover:text-brand-navy hover:underline">監修体制</Link></li>
                  <li><Link href="/evaluation-logic" className="transition hover:text-brand-navy hover:underline">評価ロジック</Link></li>
                  <li><Link href="/for-ai" className="transition hover:text-brand-navy hover:underline">AIレビュー用概要</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">規約・お問い合わせ</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li><Link href="/terms" className="transition hover:text-brand-navy hover:underline">利用規約</Link></li>
                  <li><Link href="/privacy" className="transition hover:text-brand-navy hover:underline">プライバシーポリシー</Link></li>
                  <li><Link href="/security" className="transition hover:text-brand-navy hover:underline">セキュリティ</Link></li>
                  <li><Link href="/contact" className="transition hover:text-brand-navy hover:underline">お問い合わせ</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
              &copy; {APP_NAME}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
