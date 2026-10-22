import Link from "next/link";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";
export const metadata = buildSeo({
  title: "はじめての方へ｜輸出管理の一次確認ガイド",
  description: "Export Risk Naviの公開デモ、評価の仕組み、情報の取り扱い、導入相談への進み方をご案内します。",
  path: "/getting-started",
});

const steps = [
  { number: "01", title: "何を確認するか把握する", description: "商品、仕向地、取引先、用途の情報を整理し、輸出管理の確認範囲を理解します。", href: "/learning", action: "学習ガイドを見る" },
  { number: "02", title: "公開デモで流れを体験する", description: "サンプル案件を使い、入力から確認事項の表示までの操作を体験できます。実案件の審査結果ではありません。", href: "/demo", action: "公開デモを開く" },
  { number: "03", title: "評価の根拠と限界を理解する", description: "評価観点・未調査の扱い・人手確認が必要な理由を確認します。", href: "/evaluation-logic", action: "評価ロジックを読む" },
  { number: "04", title: "導入前に情報管理を確認する", description: "機密情報や個人情報の入力可否、公開範囲、運営情報を確認してください。", href: "/security", action: "セキュリティ方針を見る" },
];

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-navy">GETTING STARTED</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">はじめての方へ</h1>
          <p className="mt-5 text-base leading-8 text-slate-700">
            輸出管理の一次確認を、迷わず始めるための案内です。公開デモの操作と、実際の輸出判断に必要な確認を区別してご利用ください。
          </p>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <strong>重要：</strong>AIの一次確認は輸出許可・取引承認ではありません。制裁照合の未実施や最終需要者・用途の未確認は「問題なし」を意味しません。
          </div>
        </div>
        <section aria-label="利用開始までの4ステップ" className="mt-10 grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.number} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="font-mono text-sm font-bold text-brand-navy">{step.number}</span>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{step.description}</p>
              <Link href={step.href} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-brand-navy underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
                {step.action} <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </article>
          ))}
        </section>
        <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">導入を検討している方へ</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            想定する業務フロー、利用人数、取り扱う情報の種類を整理したうえでご相談ください。機能提供範囲や保存・外部送信条件は導入前に確認が必要です。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg bg-brand-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-deep-light">導入について相談する</Link>
            <Link href="/operator" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-brand-navy">運営情報を見る</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
