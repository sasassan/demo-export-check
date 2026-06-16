import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-slate-900 sm:px-6">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight">プライバシーポリシー</h1>
        <div className="mt-6 space-y-6 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1. 取得する情報</h2>
            <p className="mt-2">
              本サービスでは、ログイン用メールアドレス、案件入力情報、操作に必要なセッション情報を取得します。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">2. 利用目的</h2>
            <p className="mt-2">
              取得情報は、本人識別、案件管理、レポート生成、サービス品質改善のために使用します。
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">3. 保管と管理</h2>
            <p className="mt-2">
              本番公開時は、適切なアクセス制御と安全な保存基盤を用いて情報を管理することを前提とします。
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