import Link from "next/link";

import { Header } from "@/components/layout/header";

export const dynamic = "force-static";

const sections = [
  {
    number: 1,
    title: "取得する情報",
    items: [
      "ログイン用メールアドレス",
      "案件入力情報（商品名・輸出先国・顧客企業名・型番等）",
      "AI相談室での質問内容・アップロードされた資料テキスト",
      "操作に必要なセッション情報（Cookie）",
    ],
  },
  {
    number: 2,
    title: "利用目的",
    items: [
      "本人識別およびサービス提供",
      "案件管理・リスク診断・レポート生成",
      "サービス品質改善・利用状況分析",
      "お問い合わせへの対応",
    ],
  },
  {
    number: 3,
    title: "第三者提供",
    body: "法令に基づく場合を除き、取得した個人情報を利用者の同意なく第三者に提供することはありません。",
  },
  {
    number: 4,
    title: "AI学習への利用",
    body: "入力された情報を外部AIモデルの学習データとして利用させない構成を基本方針としています。診断処理に必要な範囲でのみAI APIへ送信します。",
  },
  {
    number: 5,
    title: "保管と管理",
    body: "適切なアクセス制御と暗号化（SSL/TLS）を用い、不正アクセス・漏洩・改ざんの防止に努めます。",
  },
  {
    number: 6,
    title: "データ削除",
    body: "利用者はアカウント削除またはお問い合わせにより、保存されたデータの削除を依頼できます。",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-blue-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-brand-navy"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </span>
            <span className="trade-section-label">Privacy Policy</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">プライバシーポリシー</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            最終更新日: <span className="font-bold text-brand-navy">2025年1月</span>
          </p>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
            {sections.map((section) => (
              <section
                key={section.number}
                className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                    {section.number}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                    {section.body ? <p className="mt-2">{section.body}</p> : null}
                    {section.items ? (
                      <ul className="mt-2 space-y-1.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <svg
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            ))}
            <section className="trade-hover-lift rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                  7
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">お問い合わせ</h2>
                  <p className="mt-2">
                    プライバシーに関するお問い合わせは、
                    <Link href="/contact" className="font-semibold text-brand-navy hover:underline">
                      お問い合わせフォーム
                    </Link>
                    よりお寄せください。
                  </p>
                </div>
              </div>
            </section>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-brand-navy hover:underline">トップページへ戻る</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
