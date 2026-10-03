import Link from "next/link";

import { PublicDemoSimulator } from "@/components/demo/public-demo-simulator";
import { Header } from "@/components/layout/header";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "デモ画面",
  description:
    "商品名・型番・輸出先国・顧客企業名の入力から、該非判定・制裁・用途・国リスクの一次スクリーニング結果確認までの流れをサンプルシナリオで体験できます。",
  path: "/demo",
});

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
    items: ["用途整合性: B", "キャッチオール規制観点: B", "追加ヒアリング必要性: 高"],
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
            このページでは、公開用のサンプルシナリオを使って「入力 → リスク論点整理 → 結果確認」の流れを体験できます。
            実案件データ・顧客情報・社内案件一覧はBeta公開対象外として保護しています。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" data-cta-id="demo-contact" data-cta-label="導入について相談" data-cta-target="/contact" className="trade-primary-button">導入について相談</Link>
            <Link href="/about" data-cta-id="demo-about" data-cta-label="サービス説明を見る" data-cta-target="/about" className="trade-secondary-button">サービス説明を見る</Link>
          </div>
        </section>

        <PublicDemoSimulator />

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Why public demo is limited</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">公開デモで伏せているもの</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              <li>- 実在顧客・実案件の入力情報</li>
              <li>- ログイン後の案件一覧・調査履歴・PDF出力の内部データ</li>
              <li>- 社内確認フローに関わる個別案件情報</li>
              <li>- 実運用の保存データ、相談履歴、顧客固有文書</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">What this demo proves</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">この公開デモで確認できること</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              <li>- 商品 / 型番 / 輸出先 / 顧客名という入力導線</li>
              <li>- A / B / C 評価の見せ方</li>
              <li>- 推奨アクションと根拠サマリーの出し方</li>
              <li>- 業種別サンプル（機械 / 化学 / 半導体関連）の比較</li>
            </ul>
            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
              本番環境では、この後に案件保存、AI相談室への引き継ぎ、PDFレポート出力まで進む構成です。
            </div>
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
