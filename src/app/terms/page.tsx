import Link from "next/link";

import { Header } from "@/components/layout/header";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Terms of Service</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">利用規約</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">最終更新日: 2025年1月</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">1. 本サービスの位置づけ</h2>
              <p className="mt-2">本サービスは、輸出管理に関する参考情報および一次確認支援を提供するものです。法令上の判断、輸出可否の最終決定、社内承認の代替を行うものではありません。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">2. 利用者の責任</h2>
              <p className="mt-2">利用者は、入力情報の正確性を確保し、最終的な輸出可否の判断を自らの責任で実施するものとします。AI診断結果を唯一の根拠として輸出判断を行うことは推奨しません。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">3. 禁止事項</h2>
              <ul className="mt-2 space-y-1">
                <li>- 本サービスの不正利用・リバースエンジニアリング</li>
                <li>- 他の利用者への妨害行為</li>
                <li>- 法令に違反する目的での利用</li>
                <li>- 虚偽情報の入力によるサービスの悪用</li>
              </ul>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">4. 免責</h2>
              <p className="mt-2">本サービスの結果は参考情報であり、完全性・正確性・最新性を保証するものではありません。本サービス利用に起因して生じたいかなる損害についても、提供者は責任を負いません。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">5. サービスの変更・停止</h2>
              <p className="mt-2">提供者は、事前の通知なくサービス内容の変更・一時停止・終了を行うことがあります。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">6. 知的財産権</h2>
              <p className="mt-2">本サービスに関する知的財産権は提供者に帰属します。利用者が入力した情報の知的財産権は利用者に帰属します。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">7. お問い合わせ</h2>
              <p className="mt-2">本規約に関するお問い合わせは、<Link href="/contact" className="font-semibold text-[#1e3a5f] hover:underline">お問い合わせフォーム</Link>よりお寄せください。</p>
            </section>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-[#1e3a5f] hover:underline">トップページへ戻る</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
