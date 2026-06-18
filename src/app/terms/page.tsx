import Link from "next/link";

import { Header } from "@/components/layout/header";

export default function TermsPage() {
  return (
    <main className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-100">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="trade-glass-card rounded-[1.9rem] p-6 sm:p-8">
          <span className="trade-section-label">Terms</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">利用規約</h1>
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">1. 本サービスの位置づけ</h2>
              <p className="mt-2">本サービスは、輸出管理に関する参考情報および一次確認支援を提供するものです。法令上の判断、輸出可否の最終決定、社内承認の代替を行うものではありません。</p>
            </section>
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">2. 利用者の責任</h2>
              <p className="mt-2">利用者は、入力情報の正確性を確保し、最終的な輸出可否の判断を自らの責任で実施するものとします。</p>
            </section>
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">3. 免責</h2>
              <p className="mt-2">本サービスの結果は参考情報であり、完全性・正確性・最新性を保証するものではありません。本サービス利用に起因して生じたいかなる損害についても、提供者は責任を負いません。</p>
            </section>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-indigo-700 hover:underline">トップページへ戻る</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
