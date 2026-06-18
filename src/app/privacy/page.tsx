import Link from "next/link";

import { Header } from "@/components/layout/header";

export default function PrivacyPage() {
  return (
    <main className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-100">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="trade-glass-card rounded-[1.9rem] p-6 sm:p-8">
          <span className="trade-section-label">Privacy Policy</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">プライバシーポリシー</h1>
          <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">1. 取得する情報</h2>
              <p className="mt-2">本サービスでは、ログイン用メールアドレス、案件入力情報、操作に必要なセッション情報を取得します。</p>
            </section>
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">2. 利用目的</h2>
              <p className="mt-2">取得情報は、本人識別、案件管理、レポート生成、サービス品質改善のために使用します。</p>
            </section>
            <section className="trade-soft-block p-5">
              <h2 className="text-lg font-semibold text-slate-900">3. 保管と管理</h2>
              <p className="mt-2">本番公開時は、適切なアクセス制御と安全な保存基盤を用いて情報を管理することを前提とします。</p>
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
