import Link from "next/link";

import { Header } from "@/components/layout/header";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "利用規約",
  description:
    "輸出リスクナビ（Export Risk Navi）の利用規約です。サービス位置づけ、利用者の責任、禁止事項、免責事項などを定めています。",
  path: "/terms",
});

const sections = [
  {
    number: 1,
    title: "本サービスの位置づけ",
    body: "本サービスは、輸出管理に関する参考情報および一次確認支援を提供するものです。法令上の判断、輸出可否の最終決定、社内承認の代替を行うものではありません。",
  },
  {
    number: 2,
    title: "利用者の責任",
    body: "利用者は、入力情報の正確性を確保し、最終的な輸出可否の判断を自らの責任で実施するものとします。AI診断結果を唯一の根拠として輸出判断を行うことは推奨しません。",
  },
  {
    number: 3,
    title: "禁止事項",
    items: [
      "本サービスの不正利用・リバースエンジニアリング",
      "他の利用者への妨害行為",
      "法令に違反する目的での利用",
      "虚偽情報の入力によるサービスの悪用",
    ],
  },
  {
    number: 4,
    title: "免責",
    body: "本サービスの結果は参考情報であり、完全性・正確性・最新性を保証するものではありません。本サービス利用に起因して生じたいかなる損害についても、提供者は責任を負いません。",
  },
  {
    number: 5,
    title: "サービスの変更・停止",
    body: "提供者は、事前の通知なくサービス内容の変更・一時停止・終了を行うことがあります。",
  },
  {
    number: 6,
    title: "知的財産権",
    body: "本サービスに関する知的財産権は提供者に帰属します。利用者が入力した情報の知的財産権は利用者に帰属します。",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-10 sm:px-6 outline-none">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-tint-blue">
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
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </span>
            <span className="trade-section-label">Terms of Service</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">利用規約</h1>
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
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-deep text-xs font-bold text-white">
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
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-deep text-xs font-bold text-white">
                  7
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">お問い合わせ</h2>
                  <p className="mt-2">
                    本規約に関するお問い合わせは、
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
