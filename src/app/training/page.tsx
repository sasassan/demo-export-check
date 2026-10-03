import Link from "next/link";

import { Header } from "@/components/layout/header";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "社員教育・研修支援",
  description:
    "輸出管理基礎研修、営業担当者向け教育、外為法セミナー、法令改正時の定期講習など、輸出コンプライアンスの社内教育・研修支援を紹介します。",
  path: "/training",
});

const trainingPrograms = [
  {
    title: "輸出管理基礎研修",
    description: "営業担当・実務担当向けに、輸出管理の基本・案件確認の流れ・よくある判断ミスを整理します。",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
  {
    title: "営業担当者向け教育",
    description: "商談前に何を聞くべきか、用途確認・相手先確認・社内引き継ぎの要点を実例で学べます。",
    icon: "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z",
  },
  {
    title: "外為法セミナー",
    description: "外為法、キャッチオール規制、技術提供の基本的な考え方を、非専門家向けに分かりやすく解説します。",
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-18 0 9 6 9-6m-18 0v-.75A2.25 2.25 0 0 1 3.75 6h16.5A2.25 2.25 0 0 1 22.5 8.25V9",
  },
  {
    title: "法令改正時の定期講習",
    description: "制度改正・制裁更新・規制変更があった際の社内共有研修を想定しています。",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    title: "社内ルール策定支援",
    description: "入力ルール、エスカレーション基準、AI相談室の使い方など、運用ルール整備も支援します。",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z",
  },
  {
    title: "AI診断結果の読み方講習",
    description: "A/B/C評価、AI一致率、改善シミュレーション、レポートの使い方を実務目線で説明します。",
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
];

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </span>
            <span className="trade-section-label">Training Service</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">社員教育・研修サービス</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            AIツール導入だけでなく、営業担当・輸出担当・管理部門が共通理解を持てるようにするための、
            研修・教育・運用支援サービスをオプション提供する想定です。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trainingPrograms.map((program) => (
            <div key={program.title} className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={program.icon} />
                </svg>
              </span>
              <h2 className="mt-3 text-base font-semibold text-slate-900">{program.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{program.description}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">Why It Matters</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">AIだけで終わらせず、運用まで支援</h2>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {[
                "営業担当が何をヒアリングすべきか統一できる",
                "AI相談室や診断結果の読み方を社内で揃えられる",
                "法令改正や規制変更時の教育負荷を下げられる",
                "稟議・監査・上司説明に使える共通言語ができる",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="trade-hover-lift rounded-xl border border-brand-navy bg-gradient-to-br from-brand-navy to-blue-800 p-6 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider">Enterprise</span>
            <h2 className="mt-3 text-xl font-bold">導入前提の研修相談も可能</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              AIツールの活用だけでなく、営業・輸出管理・法務・経営層の認識をそろえるための支援メニューとして整理できます。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact?v=training" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-100">研修について相談する</Link>
              <Link href="/about?v=training" className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">サービス説明へ戻る</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
