import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-slate-900 sm:px-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">利用規約</h1>
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1. 本サービスの位置づけ</h2>
            <p className="mt-2">
              本サービスは、輸出管理に関する参考情報および一次確認支援を提供するものです。
              法令上の判断、輸出可否の最終決定、社内承認の代替を行うものではありません。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">2. 利用者の責任</h2>
            <p className="mt-2">
              利用者は、入力情報の正確性を確保し、最終的な輸出可否の判断を自らの責任で実施するものとします。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">3. 免責</h2>
            <p className="mt-2">
              本サービスの結果は参考情報であり、完全性・正確性・最新性を保証するものではありません。
              本サービス利用に起因して生じたいかなる損害についても、提供者は責任を負いません。
            </p>
          </section>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-sm font-semibold text-indigo-700 hover:underline">
            トップページへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}