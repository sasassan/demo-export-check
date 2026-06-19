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
          <span className="trade-section-label">Contact</span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">お問い合わせ</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Beta版へのご意見・利用相談・改善要望を受け付けています。フィードバックはサービス改善のために利用します。
          </p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            判定結果は参考情報であり、最終的な輸出可否判断を保証するものではありません。
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <ContactForm />
          <div className="mt-6">
            <Link href="/" className="text-sm font-semibold text-[#1e3a5f] hover:underline">トップページへ戻る</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
