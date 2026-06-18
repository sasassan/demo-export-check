import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

const heroMapOverlay =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cg fill='%230ea5e9' fill-opacity='0.09'%3E%3Cpath d='M170 310l48-18 34 16 22-11 46 8 38 24 42 3 30 19-8 22-40 2-24 16-33-1-20 13-46-8-33-24-40-5-16-28z'/%3E%3Cpath d='M640 252l44-19 58 8 26 20 39 3 18 23 56 15 23 34-19 16-45-6-28 11-17 23-50-4-28-19-45-8-37-22-7-34z'/%3E%3Cpath d='M960 286l46-12 57 6 38 18 51-4 37 21 48 6 41 25-7 24-50 8-28 17-52-4-24 16-47-14-33-22-47-5-27-32z'/%3E%3Cpath d='M1168 454l39-12 46 8 22 16 41 1 25 20 33 5 30 21-8 20-32 5-21 14-40-4-18 13-39-10-23-18-39-4-17-20z'/%3E%3Cpath d='M760 520l29-14 34 6 16 14 36 2 16 14 32 6 18 18-7 16-26 4-15 11-31-3-14 10-31-7-18-15-29-4-10-18z'/%3E%3C/g%3E%3Cg fill='none' stroke='%2306b6d4' stroke-opacity='0.24' stroke-width='2'%3E%3Cpath d='M206 338C318 328 400 370 486 356s120-58 228-51 130 40 214 31 144-48 243-41 166 45 252 29' stroke-dasharray='8 10'/%3E%3Cpath d='M286 506c80-42 150-59 252-52s128 31 216 22 150-42 238-34 138 33 232 18' stroke-dasharray='10 12'/%3E%3C/g%3E%3Cg fill='%2367e8f9' fill-opacity='0.45'%3E%3Ccircle cx='206' cy='338' r='5'/%3E%3Ccircle cx='486' cy='356' r='5'/%3E%3Ccircle cx='779' cy='269' r='5'/%3E%3Ccircle cx='1138' cy='320' r='5'/%3E%3Ccircle cx='1320' cy='500' r='5'/%3E%3Ccircle cx='872' cy='551' r='5'/%3E%3C/g%3E%3C/svg%3E\")";

const features = [
  {
    title: "制裁リスト調査",
    description: "国連・米国OFAC・EUなどの制裁対象リストに、顧客企業・担当者が該当しないかをチェックします。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
      </svg>
    ),
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    title: "エンドユーザー実在性確認",
    description: "輸出先企業の実在性・事業内容・所在地を調査し、架空企業や不審な転売業者でないか確認します。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "UBO / PEPs確認",
    description: "実質的支配者（UBO）や政治的影響力のある人物（PEPs）への関与がないか、多角的に調査します。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    color: "text-sky-600 bg-sky-50",
  },
  {
    title: "国リスク評価",
    description: "輸出先国の政情・紛争・制裁・輸出規制の状況を確認し、地政学的なリスクを数値で示します。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    color: "text-teal-600 bg-teal-50",
  },
  {
    title: "用途リスク / キャッチオール",
    description: "軍事転用・大量破壊兵器への利用が疑われる用途でないかを確認し、キャッチオール規制の該当可能性を評価します。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "PDFレポート出力",
    description: "調査結果・評価理由・根拠資料をA4形式でまとめ、上司提出・社内決裁に使えるレポートを即時生成します。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    color: "text-rose-600 bg-rose-50",
  },
];

const steps = [
  {
    number: "01",
    title: "案件情報を入力",
    description: "商品名・型番・輸出先国・顧客企業名を入力するだけ。専門知識は不要です。",
  },
  {
    number: "02",
    title: "AIが一次スクリーニングを支援",
    description: "入力情報と公開情報をもとに、制裁・企業・国別リスクなど8つの観点で評価を支援します。",
  },
  {
    number: "03",
    title: "評価とレポートを確認",
    description: "A/B/C評価と根拠をわかりやすく表示。PDFレポートもワンクリックで出力できます。",
  },
];

const dataSources = [
  {
    label: "国際制裁情報",
    desc: "国連・米国OFAC・EU・英国HMTなどの制裁対象リスト",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    label: "輸出規制情報",
    desc: "日本の外為法・EAR（米国輸出管理規則）などの規制情報",
    color: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    label: "企業公開情報",
    desc: "企業登記・所在地・事業内容などの公開データ",
    color: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    label: "国リスク情報",
    desc: "政情・紛争・地政学リスクに関する公開情報",
    color: "bg-teal-50 border-teal-200 text-teal-700",
  },
  {
    label: "用途リスク情報",
    desc: "軍事転用・大量破壊兵器関連用途に関する分類情報",
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    status: "開発中",
    statusColor: "bg-indigo-100 text-indigo-700",
    title: "輸出可否AI診断",
    items: ["A/B/C評価", "PDFレポート出力", "一次スクリーニング支援"],
  },
  {
    phase: "Phase 2",
    status: "計画中",
    statusColor: "bg-amber-100 text-amber-700",
    title: "企業・人物調査",
    items: ["企業情報調査", "UBO（実質支配者）確認", "制裁リスク詳細分析"],
  },
  {
    phase: "Phase 3",
    status: "構想中",
    statusColor: "bg-slate-100 text-slate-600",
    title: "高度なAI解析",
    items: ["商品画像解析", "戦場・ニュース類似調査", "AI市場調査"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#06111f_0%,#0b1f35_26%,#0e2b47_58%,#0a1728_100%)]">
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-50 border-b border-cyan-400/20 bg-[#071423]/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-white sm:text-lg">{APP_NAME}</span>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link
              href="/about?v=lp-nav"
              className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-slate-200 hover:bg-cyan-400/10 hover:text-white sm:flex-none"
            >
              サービス説明
            </Link>
            <Link
              href="/login?v=lp-nav"
              className="flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-slate-200 hover:bg-cyan-400/10 hover:text-white sm:flex-none"
            >
              ログイン
            </Link>
            <Link
              href="/cases/new?v=lp-nav"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700 sm:flex-none"
            >
              無料で試す
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
          <div className="trade-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.14),_transparent_56%)]" />
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.08),_transparent_70%)]" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[78%] bg-contain bg-center bg-no-repeat opacity-95"
            style={{ backgroundImage: heroMapOverlay }}
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-white/96 p-8 text-center shadow-[0_24px_80px_rgba(2,6,23,0.28)] lg:p-10 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/90 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm shadow-indigo-100/60">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                輸出管理部門がなくても使える · 営業担当者向け
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                その輸出、
                <br />
                <span className="bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">本当に大丈夫</span>
                ですか？
              </h1>
              <p className="mt-4 text-lg font-semibold text-indigo-700">
                営業担当者が商談前に5分で一次確認できます。
              </p>
              <p className="mt-3 max-w-2xl text-base leading-8 font-medium text-slate-700 lg:mx-0">
                制裁リスト・企業信用・用途・国リスクについて、
                AIが入力情報と公開情報をもとに一次スクリーニングを支援します。
                専門知識がなくても輸出コンプライアンスの初動確認を進められます。
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["平均確認時間", "約5分"],
                  ["AI診断観点", "8項目"],
                  ["出力形式", "PDF / 要約"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{label}</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/demo?v=hero"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-800 hover:to-sky-600"
                >
                  デモ画面を見る
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/about?v=hero"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  サービス説明を見る
                </Link>
                <Link
                  href="/contact?v=hero"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  フィードバックを送る
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-white/96 p-3 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/trade-hero.png"
                    alt="港湾とコンテナ、輸出管理ダッシュボードをイメージしたビジュアル"
                    width={1792}
                    height={1024}
                    className="h-auto w-full object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/50 via-slate-900/10 to-transparent" />
                  <div className="absolute left-3 top-3 max-w-[70%] rounded-2xl border border-white/30 bg-slate-950/82 px-3 py-2 text-white shadow-lg backdrop-blur sm:left-5 sm:top-5 sm:px-4 sm:py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">AI Compliance Insight</p>
                    <p className="mt-1 text-sm font-bold text-white">取引前に確認論点を素早く整理</p>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-sky-200/60 bg-white/92 p-3 shadow-lg backdrop-blur sm:bottom-5 sm:left-auto sm:right-5 sm:w-64 sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">診断サマリー</p>
                    <div className="mt-3 grid gap-3">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-sm text-slate-600">輸出先国リスク</span>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">B</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-sm text-slate-600">最終需要先確認</span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">要資料</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* サンプル評価カード */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    サンプル調査結果
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    高精度サーボモーター SRV-9800 → ベトナム
                  </p>
                </div>
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700">
                  総合評価: B
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "制裁", grade: "A", cls: "bg-emerald-50 border-emerald-100 text-emerald-600" },
                  { label: "企業信用", grade: "B", cls: "bg-amber-50 border-amber-100 text-amber-600" },
                  { label: "国リスク", grade: "B", cls: "bg-amber-50 border-amber-100 text-amber-600" },
                  { label: "用途", grade: "A", cls: "bg-emerald-50 border-emerald-100 text-emerald-600" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-xl border p-3 text-center ${item.cls}`}>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold">{item.grade}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                類似名称確認と用途確認を追加で行えば、営業段階でも判断材料として使える状態です。
              </p>
            </div>
          </div>
        </section>

        {/* 3ステップセクション */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-white/96 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">3ステップで完了</h2>
              <p className="mt-3 text-base text-slate-600">
                専門知識不要。商品情報を入力するだけで一次確認の論点を整理できます。
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="rounded-2xl border border-cyan-400/20 bg-white/96 p-6 text-center shadow-lg shadow-slate-950/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 font-medium text-slate-700">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 診断レポートサンプルセクション */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-white/96 px-6 py-10 shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
              <div className="text-center">
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  診断レポートサンプル
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  入力したら何が出るのか
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  診断結果はこのように表示されます。A4レポートとしてPDF出力も可能です。
                </p>
              </div>
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {/* レポート1ページ目 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">診断レポート — 1ページ目</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">高精度サーボモーター SRV-9800 → ベトナム</p>
                    </div>
                    <span className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">B</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "制裁リスト", score: "95", grade: "A", c: "emerald" },
                      { label: "企業信用", score: "72", grade: "B", c: "amber" },
                      { label: "国リスク", score: "68", grade: "B", c: "amber" },
                      { label: "用途", score: "88", grade: "A", c: "emerald" },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-xl border p-2 bg-${item.c}-50 border-${item.c}-100`}>
                        <p className="text-[10px] text-slate-500">{item.label}</p>
                        <p className={`mt-1 text-xl font-bold text-${item.c}-600`}>{item.grade}</p>
                        <p className="text-[10px] text-slate-400">{item.score}点</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-700">総合リスク概要</p>
                    <p className="mt-1 text-xs text-slate-600 leading-5">
                      ベトナムは中程度の国リスク。企業の登記情報は確認済みだが、
                      類似名称企業の存在を確認する必要あり。用途は産業機械として適切。
                    </p>
                  </div>
                </div>

                {/* レポート2ページ目 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 border-b border-slate-100 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">診断レポート — 2ページ目</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">判定理由・確認ポイント・推奨対応</p>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-bold text-amber-700">要確認：企業信用</p>
                      <p className="mt-1 text-xs text-amber-800">類似名称の別企業が同地域に存在。商標登記番号または法人番号を取引先に確認してください。</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-700">推奨アクション</p>
                      <ul className="mt-1 space-y-1 text-xs text-slate-600">
                        <li>· 取引先の法人登記証明書を入手</li>
                        <li>· 最終用途証明書（EUC）を取得</li>
                        <li>· 社内輸出管理担当者へ連携</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                      <p className="text-xs font-bold text-indigo-700">免責事項</p>
                      <p className="mt-1 text-xs text-indigo-800">本レポートは参考情報です。最終的な輸出可否の判断は利用者自身の責任で実施してください。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/demo?v=report-sample"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-800 hover:to-sky-600"
                >
                  実際のデモを見る
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 判定根拠の可視化セクション */}
        <section className="px-6 pb-8">
          <div className="trade-dark-panel mx-auto max-w-6xl rounded-[2rem] px-6 py-10 text-white lg:px-10">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-indigo-200">
                判定の根拠
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                何をもとに判定しているのか
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-200">
                AIが一次スクリーニングに使用する情報源を公開しています。
                最終的な判断は利用者自身が行ってください。
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dataSources.map((src) => (
                <div key={src.label} className={`rounded-2xl border bg-white px-5 py-4 ${src.color.split(" ").slice(0, 2).join(" ")}`}>
                  <p className={`text-sm font-bold ${src.color.split(" ")[2]}`}>{src.label}</p>
                  <p className="mt-1 text-sm text-slate-700">{src.desc}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-sm font-bold text-cyan-100">免責・注意事項</p>
                <p className="mt-1 text-sm text-slate-300">
                  本サービスは一次スクリーニング支援ツールです。法令上の最終判断を代替するものではありません。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI診断機能セクション */}
        <section className="px-6 pb-8">
          <div className="trade-dark-panel mx-auto max-w-6xl rounded-[2rem] px-6 py-8 text-white lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-indigo-200">
                  NEW AI診断機能
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  AIが案件の危険信号を文章で解説
                </h2>
                <p className="mt-4 text-base leading-8 font-medium text-slate-100">
                  単にA/B/Cを返すだけでなく、なぜその評価になったか、営業担当が次に何を確認すべきかを、
                  わかりやすい日本語で提示します。
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "AIリスク診断",
                    text: "案件情報から重要な確認漏れを抽出し、優先順位付きで案内します。",
                  },
                  {
                    title: "確認アクション提案",
                    text: "顧客へ聞くべき項目や回収すべき資料を即時に表示します。",
                  },
                  {
                    title: "エビデンス要約",
                    text: "根拠ソースを一行で把握できるので、社内共有がスムーズです。",
                  },
                  {
                    title: "決裁向けレポート",
                    text: "調査サマリーと次アクションをそのままPDF化して提出できます。",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 信頼性セクション */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-cyan-400/20 bg-white/96 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.2)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                  About This Service
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  誰が、なぜ作っているのか
                </h2>
                <p className="mt-4 text-base leading-8 font-medium text-slate-700">
                  輸出管理・海外業務の実務経験を背景に、
                  「中小企業の営業担当者でも一次確認ができる」ツールを目指して開発しています。
                </p>
                <p className="mt-3 text-base leading-8 font-medium text-slate-700">
                  大企業には専任の輸出管理部門があります。しかし中小企業の現場では、
                  営業担当者が輸出コンプライアンスの初動判断を迫られることが多くあります。
                  このサービスは、そのような現場の課題を解決するために開発中です。
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    title: "輸出管理部門がなくても使える",
                    desc: "専門知識不要。商品と取引先の基本情報を入力するだけで一次確認を進められます。",
                    color: "border-indigo-200 bg-indigo-50",
                    textColor: "text-indigo-700",
                  },
                  {
                    title: "営業担当者が商談前に確認できる",
                    desc: "5分で完了するスクリーニングで、商談前のリスク把握が可能です。",
                    color: "border-sky-200 bg-sky-50",
                    textColor: "text-sky-700",
                  },
                  {
                    title: "判断根拠を可視化して共有",
                    desc: "評価理由と根拠をPDFで出力し、上司・法務担当へスムーズに連携できます。",
                    color: "border-teal-200 bg-teal-50",
                    textColor: "text-teal-700",
                  },
                ].map((item) => (
                  <div key={item.title} className={`rounded-2xl border p-4 ${item.color}`}>
                    <p className={`text-sm font-bold ${item.textColor}`}>{item.title}</p>
                    <p className="mt-1 text-sm text-slate-700">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 機能カードセクション */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-white/96 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">8つの観点で一次スクリーニングを支援</h2>
              <p className="mt-3 text-base text-slate-600">
                従来は属人的だった一次確認の論点整理を、AIが短時間で支援します。
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div className={`inline-flex rounded-xl p-3 ${feature.color}`}>{feature.icon}</div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 font-medium text-slate-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金セクション */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-cyan-400/20 bg-white/96 px-6 py-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
              <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
                料金プラン
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">シンプルな料金体系</h2>
              <p className="mt-3 text-base text-slate-600">
                β版は無料でご利用いただけます。正式版の料金は準備中です。
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {/* β版プラン */}
              <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg">
                <div className="absolute -top-3 left-6">
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">現在公開中</span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">β版</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">無料</p>
                <p className="mt-1 text-sm text-slate-500">β版期間中は全機能を無料でご利用いただけます</p>
                <ul className="mt-6 space-y-3">
                  {[
                    "AI一次スクリーニング（8観点）",
                    "A/B/C評価 + 判定理由表示",
                    "PDFレポート出力",
                    "案件管理（β版制限あり）",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0 text-indigo-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login?v=pricing"
                  className="mt-8 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  無料で始める
                </Link>
              </div>

              {/* 正式版プラン */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">正式版（準備中）</p>
                <p className="mt-2 text-4xl font-bold text-slate-400">未定</p>
                <p className="mt-1 text-sm text-slate-400">月額料金・プランは検討中です</p>
                <ul className="mt-6 space-y-3">
                  {[
                    "β版の全機能",
                    "企業情報・UBO詳細調査",
                    "制裁リストリアルタイム照合",
                    "チーム共有・管理機能",
                    "API連携（開発者向け）",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0 text-slate-300">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact?v=pricing"
                  className="mt-8 block rounded-xl border border-slate-300 bg-white py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  リリース通知を受け取る
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ロードマップセクション */}
        <section className="px-6 pb-8">
          <div className="trade-dark-panel mx-auto max-w-5xl rounded-[2rem] px-6 py-10 text-white lg:px-10">
            <div className="text-center">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-indigo-200">
                開発ロードマップ
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                中小企業向け輸出リスク判断支援プラットフォームへ
              </h2>
              <p className="mt-3 text-base text-slate-200">
                単なるAIチャットではなく、輸出コンプライアンスの実務を支援するプラットフォームを目指しています。
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {roadmap.map((phase) => (
                <div key={phase.phase} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">{phase.phase}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{phase.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl rounded-2xl bg-indigo-600 px-8 py-12 text-center">
            <h2 className="text-3xl font-bold text-white">まずは1件、試してみてください</h2>
            <p className="mt-3 text-base font-medium text-indigo-100">
              β版は無料。メールアドレスだけで開始できます。登録後すぐに案件確認フローを試せます。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login?v=cta"
                className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-700 hover:bg-indigo-50"
              >
                無料で始める（β版）
              </Link>
              <Link
                href="/demo?v=cta"
                className="rounded-xl border border-indigo-400 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500"
              >
                デモを見る
              </Link>
              <Link
                href="/contact?v=cta"
                className="rounded-xl border border-indigo-400 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-500"
              >
                フィードバックを送る
              </Link>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="border-t border-cyan-400/12 px-6 py-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-300 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-3 w-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z" />
                </svg>
              </div>
              <span className="font-medium text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm leading-6 text-slate-200">
              本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
              最終的な輸出可否の判断は利用者自身の責任で実施してください。
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
