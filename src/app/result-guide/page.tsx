import Link from "next/link";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata = buildSeo({
  title: "診断結果の読み方｜未確認・根拠・次の対応",
  description: "Export Risk Naviの評価グレードと未確認事項、根拠の見方、次に必要な社内確認について解説します。",
  path: "/result-guide",
});

const items = [
  { title: "総合評価", description: "A・B・Cなどの評価は一次確認の整理に使う目安です。輸出許可や取引承認を意味しません。", tag: "評価" },
  { title: "調査の実施状況", description: "「未実施」「取得失敗」「資料不足」は、懸念がない状態とは異なります。安全側の判断を保留し、再確認します。", tag: "最優先" },
  { title: "根拠と更新日時", description: "参照先URL、発行主体、取得日、対象企業の同一性を確認します。AIの要約だけで裏付け済みとは扱いません。", tag: "証跡" },
  { title: "推奨アクション", description: "不足している仕様書、最終需要者情報、用途確認書、制裁照合記録などを具体的な担当者へ引き継ぎます。", tag: "次の対応" },
];

export default function ResultGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-navy">READ THE RESULT</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">診断結果の読み方</h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            大切なのはグレードの高さ・低さだけではありません。調査できた範囲、確認できなかった事項、根拠、次に行う確認をセットで読み取ってください。
          </p>
        </div>
        <section aria-label="診断結果の4つの確認ポイント" className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-brand-navy">{item.tag}</span>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
            </article>
          ))}
        </section>
        <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">表示例：最終需要者が未確認の場合</h2>
            <p className="mt-2 text-sm text-slate-600">以下は架空の説明例であり、実際の調査結果ではありません。</p>
          </div>
          <div className="space-y-4 p-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-950">判断保留・追加確認が必要</p>
              <p className="mt-2 text-sm leading-7 text-amber-900">最終需要者が特定できていないため、制裁・用途リスクの確認が完了していません。</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">企業名</p><p className="mt-2 text-sm font-semibold text-slate-900">入力済み</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">最終需要者</p><p className="mt-2 text-sm font-semibold text-amber-800">未確認</p></div>
              <div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">制裁照合</p><p className="mt-2 text-sm font-semibold text-amber-800">実施状況の確認が必要</p></div>
            </div>
            <h3 className="pt-2 text-base font-bold text-slate-900">担当者が次に行うこと</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
              <li>契約先と最終需要者の関係を確認する</li>
              <li>法人識別情報・所在地・用途確認書を収集する</li>
              <li>制裁照合の対象・情報源・照合日時を記録する</li>
              <li>社内の輸出管理責任者に判断を引き継ぐ</li>
            </ol>
          </div>
        </section>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/demo" className="inline-flex min-h-11 items-center rounded-lg bg-brand-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-deep-light">公開デモを見る</Link>
          <Link href="/evaluation-logic" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-brand-navy">評価ロジックを確認</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
