import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

const features = [
  {
    title: "制裁リスト調査",
    description: "国連・米国OFAC・EUなどの制裁対象リストに顧客企業・担当者が該当しないかをチェックします。",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z",
  },
  {
    title: "エンドユーザー実在性確認",
    description: "輸出先企業の実在性・事業内容・所在地を調査し、架空企業や不審な転売業者でないか確認します。",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    title: "UBO / PEPs確認",
    description: "実質的支配者（UBO）や政治的影響力のある人物（PEPs）への関与がないか調査します。",
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  },
  {
    title: "国リスク評価",
    description: "輸出先国の政情・紛争・制裁・輸出規制の状況を確認し、地政学的リスクを数値化します。",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418",
  },
  {
    title: "用途リスク / キャッチオール",
    description: "軍事転用・大量破壊兵器への利用が疑われる用途でないかを確認し、規制該当可能性を評価します。",
    icon: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z",
  },
  {
    title: "PDFレポート出力",
    description: "調査結果・評価理由・根拠資料をA4形式でまとめ、上司提出・社内決裁に使えるレポートを生成します。",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  },
];

const steps = [
  { number: "01", title: "案件情報を入力", description: "商品名・型番・輸出先国・顧客企業名を入力するだけ。専門知識は不要です。" },
  { number: "02", title: "AIが一次スクリーニングを支援", description: "入力情報と公開情報をもとに、制裁・企業・国別リスクなど8つの観点で評価を支援します。" },
  { number: "03", title: "評価とレポートを確認", description: "A/B/C評価と根拠をわかりやすく表示。PDFレポートもワンクリックで出力できます。" },
];

const roadmap = [
  { phase: "Phase 1", status: "開発中", title: "輸出可否AI診断", items: ["A/B/C評価", "PDFレポート出力", "一次スクリーニング支援"], active: true },
  { phase: "Phase 2", status: "計画中", title: "企業・人物調査", items: ["企業情報調査", "UBO（実質支配者）確認", "制裁リスク詳細分析"], active: false },
  { phase: "Phase 3", status: "構想中", title: "高度なAI解析", items: ["商品画像解析", "戦場・ニュース類似調査", "AI市場調査"], active: false },
];

const quickLinks = [
  { href: "/demo", label: "デモ画面", desc: "実際の診断フローを体験" },
  { href: "/glossary", label: "輸出辞典", desc: "専門用語を検索・解説" },
  { href: "/ai-room", label: "AI相談室", desc: "規制資料の読み方を相談" },
  { href: "/learning", label: "学習コンテンツ", desc: "失敗例・注意事項を確認" },
  { href: "/security", label: "セキュリティ", desc: "AI入力ガイドライン" },
  { href: "/training", label: "研修支援", desc: "営業教育・社内ルール整備" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: APP_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "ja-JP",
  description:
    "中小企業向けの輸出リスク調査・評価Webアプリ。営業担当者が商談前に一次確認でき、AI相談室で規制資料や社内規程の読解支援も行う。",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a5f]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/about?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">概要</Link>
            <Link href="/glossary?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">辞典</Link>
            <Link href="/ai-room?v=lp-nav" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">AI相談室</Link>
            <Link href="/demo?v=lp-nav" className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:inline-flex">デモ</Link>
            <span className="mx-1 hidden h-5 w-px bg-slate-200 md:block" />
            <Link href="/contact?v=lp-nav" className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2a4a73]">お問い合わせ</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* クイックリンク */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((item) => (
              <Link key={item.label} href={item.href} className="group rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-[#1e3a5f]">{item.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ヒーローセクション */}
        <section className="border-b border-slate-100 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#1e3a5f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a5f]" />
                営業担当者向け 輸出リスク一次確認ツール
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                その輸出、<br />
                <span className="text-[#1e3a5f]">本当に大丈夫</span>ですか？
              </h1>
              <p className="mt-4 text-lg font-medium text-[#1e3a5f]">
                営業担当者が商談前に5分で一次確認できます。
              </p>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                制裁リスト・企業信用・用途・国リスクについて、
                AIが入力情報と公開情報をもとに一次スクリーニングを支援します。
                専門知識がなくても輸出コンプライアンスの初動確認を進められます。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo?v=hero" className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a4a73]">
                  デモ画面を見る
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
                </Link>
                <Link href="/about?v=hero" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                  サービス説明
                </Link>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                まずは公開デモで入力〜結果確認の流れをご覧ください。導入相談・フィードバックは各ページ下部から受け付けています。
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  ["平均確認時間", "約5分"],
                  ["AI診断観点", "8項目"],
                  ["出力形式", "PDF / 要約"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <Image
                  src="/trade-hero.png"
                  alt="輸出管理ダッシュボード"
                  width={1792}
                  height={1024}
                  className="h-auto w-full object-cover"
                  priority
                  unoptimized
                />
              </div>
              {/* サンプル評価カード */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">サンプル調査結果</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">高精度サーボモーター SRV-9800 → ベトナム</p>
                  </div>
                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">B</span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[
                    { label: "制裁", grade: "A", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
                    { label: "企業信用", grade: "B", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
                    { label: "国リスク", grade: "B", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
                    { label: "用途", grade: "A", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border p-2 text-center ${item.bg} ${item.border}`}>
                      <p className="text-[10px] text-slate-500">{item.label}</p>
                      <p className={`mt-0.5 text-lg font-bold ${item.text}`}>{item.grade}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3ステップ */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">3ステップで完了</h2>
            <p className="mt-2 text-base text-slate-600">専門知識不要。商品情報を入力するだけで一次確認の論点を整理できます。</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">{step.number}</div>
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
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1e3a5f]">
                診断レポートサンプル
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">入力したら何が出るのか</h2>
              <p className="mt-2 text-base text-slate-600">診断結果はこのように表示されます。A4レポートとしてPDF出力も可能です。</p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e3a5f]">診断レポート - 1ページ目</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">高精度サーボモーター SRV-9800 → ベトナム</p>
                  </div>
                  <span className="rounded-md bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-700">B</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "制裁リスト", score: "95", grade: "A", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
                    { label: "企業信用", score: "72", grade: "B", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
                    { label: "国リスク", score: "68", grade: "B", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
                    { label: "用途", score: "88", grade: "A", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border p-2 ${item.bg} ${item.border}`}>
                      <p className="text-[10px] text-slate-500">{item.label}</p>
                      <p className={`mt-0.5 text-lg font-bold ${item.text}`}>{item.grade}</p>
                      <p className="text-[10px] text-slate-400">{item.score}点</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">総合リスク概要</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">ベトナムは中程度の国リスク。企業の登記情報は確認済みだが、類似名称企業の存在を確認する必要あり。用途は産業機械として適切。</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e3a5f]">診断レポート - 2ページ目</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">判定理由・確認ポイント・推奨対応</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-bold text-amber-700">要確認：企業信用</p>
                    <p className="mt-1 text-xs text-amber-800">類似名称の別企業が同地域に存在。商標登記番号または法人番号を取引先に確認してください。</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-700">推奨アクション</p>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      <li>- 取引先の法人登記証明書を入手</li>
                      <li>- 最終用途証明書（EUC）を取得</li>
                      <li>- 社内輸出管理担当者へ連携</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold text-slate-500">免責事項</p>
                    <p className="mt-1 text-xs text-slate-500">本レポートは参考情報です。最終的な輸出可否の判断は利用者自身の責任で実施してください。</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link href="/demo?v=report-sample" className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a4a73]">
                実際のデモを見る
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 判定根拠セクション */}
        <section className="border-b border-slate-100 bg-[#1e3a5f] px-4 py-16 text-white sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-100">判定の根拠</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">何をもとに判定しているのか</h2>
              <p className="mt-2 text-base text-blue-100">AIが一次スクリーニングに使用する情報源を公開しています。</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "国際制裁情報", desc: "国連・米国OFAC・EU・英国HMTなどの制裁対象リスト" },
                { label: "輸出規制情報", desc: "日本の外為法・EAR（米国輸出管理規則）などの規制情報" },
                { label: "企業公開情報", desc: "企業登記・所在地・事業内容などの公開データ" },
                { label: "国リスク情報", desc: "政情・紛争・地政学リスクに関する公開情報" },
                { label: "用途リスク情報", desc: "軍事転用・大量破壊兵器関連用途に関する分類情報" },
              ].map((src) => (
                <div key={src.label} className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <p className="text-sm font-semibold">{src.label}</p>
                  <p className="mt-1 text-sm text-blue-100">{src.desc}</p>
                </div>
              ))}
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm font-semibold text-blue-200">免責事項</p>
                <p className="mt-1 text-sm text-blue-200/80">本サービスは一次スクリーニング支援ツールです。法令上の最終判断を代替するものではありません。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1e3a5f]">
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
                  title: "法的判断の代替ではない",
                  text: "一次確認・論点整理・理解支援を目的とし、社内承認や専門家判断を置き換えるものではありません。",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI診断機能 */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1e3a5f]">AI診断機能</span>
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
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1e3a5f]">About This Service</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">誰が、なぜ作っているのか</h2>
                <p className="mt-3 text-base leading-7 text-slate-600">輸出管理・海外業務の実務経験を背景に、「中小企業の営業担当者でも一次確認ができる」ツールを目指して開発しています。</p>
                <p className="mt-2 text-base leading-7 text-slate-600">大企業には専任の輸出管理部門があります。しかし中小企業の現場では、営業担当者が輸出コンプライアンスの初動判断を迫られることが多くあります。</p>
              </div>
              <div className="space-y-3">
                {[
                  { title: "輸出管理部門がなくても使える", desc: "専門知識不要。商品と取引先の基本情報を入力するだけで一次確認を進められます。", border: "border-l-[#1e3a5f]" },
                  { title: "営業担当者が商談前に確認できる", desc: "5分で完了するスクリーニングで、商談前のリスク把握が可能です。", border: "border-l-[#0d9488]" },
                  { title: "判断根拠を可視化して共有", desc: "評価理由と根拠をPDFで出力し、上司・法務担当へスムーズに連携できます。", border: "border-l-[#2563eb]" },
                ].map((item) => (
                  <div key={item.title} className={`rounded-lg border border-slate-200 border-l-4 ${item.border} bg-white p-4 shadow-sm`}>
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
                <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-[#1e3a5f]">
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
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1e3a5f]">料金プラン</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">シンプルな料金体系</h2>
              <p className="mt-2 text-base text-slate-600">Beta版は無料でご利用いただけます。正式版の料金は準備中です。</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="relative rounded-xl border-2 border-[#1e3a5f] bg-white p-7 shadow-sm">
                <span className="absolute -top-3 left-5 rounded-full bg-[#1e3a5f] px-3 py-0.5 text-xs font-bold text-white">現在公開中</span>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#1e3a5f]">Beta版</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">無料</p>
                <p className="mt-1 text-sm text-slate-500">Beta版期間中は全機能を無料でご利用いただけます</p>
                <ul className="mt-5 space-y-2.5">
                  {["AI一次スクリーニング（8観点）", "A/B/C評価 + 判定理由表示", "PDFレポート出力", "案件管理（Beta版制限あり）"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[#1e3a5f]"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/demo?v=pricing" className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#1e3a5f] py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2a4a73]">デモで試す</Link>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">正式版（準備中）</p>
                <p className="mt-2 text-3xl font-bold text-slate-300">未定</p>
                <p className="mt-1 text-sm text-slate-400">月額料金・プランは検討中です</p>
                <ul className="mt-5 space-y-2.5">
                  {["Beta版の全機能", "企業情報・UBO詳細調査", "制裁リストリアルタイム照合", "チーム共有・管理機能", "API連携（開発者向け）"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-300"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/contact?v=pricing" className="mt-6 flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">リリース通知を受け取る</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Training */}
        <section className="border-b border-slate-100 bg-slate-50 px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#1e3a5f]">TRUST & SECURITY</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">AI入力の不安に先回りして対応</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">図面・仕様書をAIへ入力してよいか、技術提供に該当しないか。企業導入でよく出る懸念を整理したガイドラインを用意しています。</p>
              <div className="mt-4 flex gap-3">
                <Link href="/security?v=lp" className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a4a73]">セキュリティ方針</Link>
                <Link href="/ai-room?v=lp-security" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">AI相談室で確認</Link>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#1e3a5f]">TRAINING SERVICE</span>
              <h2 className="mt-3 text-lg font-bold text-slate-900">AI導入だけでなく、運用教育まで支援</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">営業担当向け教育、外為法セミナー、法令改正時の定期講習、社内ルール策定支援など。</p>
              <div className="mt-4 flex gap-3">
                <Link href="/training?v=lp" className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2a4a73]">研修サービス</Link>
                <Link href="/contact?v=lp-training" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">導入相談</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ロードマップ */}
        <section className="border-b border-slate-100 bg-[#1e3a5f] px-4 py-16 text-white sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-100">ロードマップ</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">中小企業向け輸出リスク判断支援プラットフォームへ</h2>
              <p className="mt-2 text-base text-blue-100">単なるAIチャットではなく、輸出コンプライアンスの実務を支援するプラットフォームを目指しています。</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {roadmap.map((phase) => (
                <div key={phase.phase} className={`rounded-lg border p-5 ${phase.active ? "border-white/20 bg-white/15" : "border-white/10 bg-white/5"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-200">{phase.phase}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${phase.active ? "bg-white/20 text-white" : "bg-white/10 text-blue-200"}`}>{phase.status}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold">{phase.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-blue-100">
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

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">まずは1件、試してみてください</h2>
            <p className="mt-2 text-base text-slate-600">Beta版は無料。メールアドレスだけで開始できます。登録後すぐに案件確認フローを試せます。</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/demo?v=cta" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">デモを見る</Link>
              <Link href="/contact?v=cta" className="rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#2a4a73]">導入について相談する</Link>
              <Link href="/contact?v=cta-fb" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">フィードバックを送る</Link>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t border-slate-200 bg-slate-50 px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1e3a5f]">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">{APP_NAME}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <Link href="/terms" className="hover:text-slate-700 hover:underline">利用規約</Link>
              <Link href="/privacy" className="hover:text-slate-700 hover:underline">プライバシーポリシー</Link>
              <Link href="/security" className="hover:text-slate-700 hover:underline">セキュリティ</Link>
              <Link href="/for-ai" className="hover:text-slate-700 hover:underline">AIレビュー用概要</Link>
              <Link href="/contact" className="hover:text-slate-700 hover:underline">お問い合わせ</Link>
            </div>
            <p className="max-w-md text-center text-xs leading-5 text-slate-400 md:text-right">
              本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
