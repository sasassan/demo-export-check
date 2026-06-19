import Link from "next/link";

import { Header } from "@/components/layout/header";

const trainingPrograms = [
  { title: "輸出管理基礎研修", description: "営業担当・実務担当向けに、輸出管理の基本・案件確認の流れ・よくある判断ミスを整理します。" },
  { title: "営業担当者向け教育", description: "商談前に何を聞くべきか、用途確認・相手先確認・社内引き継ぎの要点を実例で学べます。" },
  { title: "外為法セミナー", description: "外為法、キャッチオール規制、技術提供の基本的な考え方を、非専門家向けに分かりやすく解説します。" },
  { title: "法令改正時の定期講習", description: "制度改正・制裁更新・規制変更があった際の社内共有研修を想定しています。" },
  { title: "社内ルール策定支援", description: "入力ルール、エスカレーション基準、AI相談室の使い方など、運用ルール整備も支援します。" },
  { title: "AI診断結果の読み方講習", description: "A/B/C評価、AI一致率、改善シミュレーション、レポートの使い方を実務目線で説明します。" },
];

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Training Service</span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">社員教育・研修サービス</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            AIツール導入だけでなく、営業担当・輸出担当・管理部門が共通理解を持てるようにするための、
            研修・教育・運用支援サービスをオプション提供する想定です。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trainingPrograms.map((program) => (
            <div key={program.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">{program.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{program.description}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Why It Matters</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">AIだけで終わらせず、運用まで支援</h2>
            <ul className="mt-4 space-y-2">
              {[
                "営業担当が何をヒアリングすべきか統一できる",
                "AI相談室や診断結果の読み方を社内で揃えられる",
                "法令改正や規制変更時の教育負荷を下げられる",
                "稟議・監査・上司説明に使える共通言語ができる",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1e3a5f]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-[#1e3a5f] p-6 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider">Enterprise</span>
            <h2 className="mt-3 text-xl font-bold">導入前提の研修相談も可能</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              AIツールの活用だけでなく、営業・輸出管理・法務・経営層の認識をそろえるための支援メニューとして整理できます。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact?v=training" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-slate-100">研修について相談する</Link>
              <Link href="/about?v=training" className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">サービス説明へ戻る</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
