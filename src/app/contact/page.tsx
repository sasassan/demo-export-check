import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { Header } from "@/components/layout/header";

export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">お問い合わせ</span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">お問い合わせ</h1>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Beta版へのご意見・利用相談・改善要望を受け付けています。フィードバックはサービス改善のために利用します。
          </p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            判定結果は参考情報であり、最終的な輸出可否判断を保証するものではありません。
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800">
            お問い合わせには原則として 1営業日以内の一次返信を目標としています。Beta期間中のため、内容によってはお時間をいただく場合があります。
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <ContactForm />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">こんなご相談を受け付けています</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                <li>- 自社の営業フローに合うか確認したい</li>
                <li>- 公開デモ以外の使い方を見たい</li>
                <li>- NDAや専用環境の相談をしたい</li>
                <li>- AI相談室の読解支援を業務導入できるか知りたい</li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">事前に書いていただけるとスムーズな情報</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                <li>- 想定している利用部門（営業 / 法務 / 管理部門 など）</li>
                <li>- 想定案件数や対象商材</li>
                <li>- 課題感（制裁確認、用途確認、資料読解など）</li>
                <li>- 希望時期や相談したいテーマ</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/" className="text-sm font-semibold text-brand-navy hover:underline">トップページへ戻る</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
