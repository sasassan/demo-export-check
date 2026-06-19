import Link from "next/link";

import { Header } from "@/components/layout/header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Privacy Policy</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">プライバシーポリシー</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">最終更新日: 2025年1月</p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">1. 取得する情報</h2>
              <ul className="mt-2 space-y-1">
                <li>- ログイン用メールアドレス</li>
                <li>- 案件入力情報（商品名・輸出先国・顧客企業名・型番等）</li>
                <li>- AI相談室での質問内容・アップロードされた資料テキスト</li>
                <li>- 操作に必要なセッション情報（Cookie）</li>
              </ul>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">2. 利用目的</h2>
              <ul className="mt-2 space-y-1">
                <li>- 本人識別およびサービス提供</li>
                <li>- 案件管理・リスク診断・レポート生成</li>
                <li>- サービス品質改善・利用状況分析</li>
                <li>- お問い合わせへの対応</li>
              </ul>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">3. 第三者提供</h2>
              <p className="mt-2">法令に基づく場合を除き、取得した個人情報を利用者の同意なく第三者に提供することはありません。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">4. AI学習への利用</h2>
              <p className="mt-2">入力された情報を外部AIモデルの学習データとして利用させない構成を基本方針としています。診断処理に必要な範囲でのみAI APIへ送信します。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">5. 保管と管理</h2>
              <p className="mt-2">適切なアクセス制御と暗号化（SSL/TLS）を用い、不正アクセス・漏洩・改ざんの防止に努めます。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">6. データ削除</h2>
              <p className="mt-2">利用者はアカウント削除またはお問い合わせにより、保存されたデータの削除を依頼できます。</p>
            </section>
            <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">7. お問い合わせ</h2>
              <p className="mt-2">プライバシーに関するお問い合わせは、<Link href="/contact" className="font-semibold text-[#1e3a5f] hover:underline">お問い合わせフォーム</Link>よりお寄せください。</p>
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
