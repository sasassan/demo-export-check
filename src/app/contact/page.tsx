import Link from "next/link";

import { ContactForm } from "@/components/forms/contact-form";
import { Header } from "@/components/layout/header";

export default function ContactPage() {
  return (
    <main className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-100">
      <Header />
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="trade-glass-card rounded-[1.9rem] p-6 sm:p-8">
          <span className="trade-section-label">Contact</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            問い合わせフォーム
          </h1>
          <p className="mt-4 text-base leading-8 font-medium text-slate-700">
            β版へのご意見・利用相談・改善要望を受け付けています。フィードバックはMVP改善のために利用します。
          </p>
          <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/90 px-4 py-3 text-sm leading-7 text-cyan-900">
            判定結果は参考情報であり、最終的な輸出可否判断を保証するものではありません。
          </div>
        </section>

        <section className="trade-glass-card rounded-[1.9rem] p-6 sm:p-8">
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
