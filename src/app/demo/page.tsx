import Link from "next/link";

import { Header } from "@/components/layout/header";

const sections = [
  {
    title: "判定理由",
    items: [
      "輸出先国に一部注意対象の物流ルートが含まれるため、追加確認を推奨",
      "顧客企業名の英字表記に揺れがあり、制裁再検索が必要",
      "用途説明はあるものの、最終需要先の裏取り資料が不足",
    ],
  },
  {
    title: "国リスク",
    items: ["地政学リスク: B", "規制変動リスク: B", "物流・通関リスク: A"],
  },
  {
    title: "エンドユーザーリスク",
    items: ["実在性確認: A", "制裁スクリーニング: B", "UBO / PEPs確認: B"],
  },
  {
    title: "用途リスク",
    items: ["用途整合性: B", "キャッチオール観点: B", "追加ヒアリング必要性: 高"],
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Public Demo</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">デモ画面</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            このページは公開確認用のデモです。実際の輸出リスク判定機能・案件データ・管理画面はBeta公開対象外として保護しています。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="trade-primary-button">問い合わせる</Link>
            <Link href="/about" className="trade-secondary-button">サービス説明を見る</Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
              <div className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700">{item}</div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
