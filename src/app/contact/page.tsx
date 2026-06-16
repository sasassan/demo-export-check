import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <main className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <section className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Contact
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            問い合わせフォーム
          </h1>
          <p className="mt-4 text-base leading-8 font-medium text-slate-700">
            β版へのご意見・利用相談・改善要望を受け付けています。フィードバックはMVP改善のために利用します。
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
            判定結果は参考情報であり、最終的な輸出可否判断を保証するものではありません。
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-indigo-200/50 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <ContactForm />
          <div className="mt-6">
            <Link href="/" className="text-sm font-semibold text-indigo-700 hover:underline">
              トップページへ戻る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}