import Link from "next/link";

import { Shell } from "@/components/layout/shell";
import { REGULATION_ARTICLES } from "@/lib/regulation-articles";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "輸出規制アップデート",
  description:
    "輸出管理・制裁・キャッチオール規制・技術提供に関する最新の規制アップデートと確認ポイントを、カテゴリ・地域・案件への影響つきのサマリー記事として整理して紹介します。",
  path: "/updates",
  keywords: ["規制アップデート", "制裁", "みなし輸出", "該非判定", "キャッチオール規制"],
});

const templateFields = [
  { label: "title", meaning: "記事タイトル（結論を端的に）", example: "デュアルユース品目の該非判定精度が求められています" },
  { label: "category", meaning: "記事の分類", example: "制裁 / 品目規制 / 手続き / 技術提供 / キャッチオール" },
  { label: "region", meaning: "対象地域", example: "日本 / 米国 / EU / 国際 / 複数地域" },
  { label: "publishedAt", meaning: "公開日（YYYY-MM-DD）", example: "2026-06-01" },
  { label: "summary", meaning: "1〜2文のサマリー", example: "高性能部品は用途次第で規制対象になり得ます。" },
  { label: "impact", meaning: "案件判断への影響", example: "型番・仕様・用途をまとめて該非判定を確認します。" },
  { label: "keyPoints", meaning: "押さえておきたいポイント（3件前後）", example: "仕様に基づく該非判定 / 用途確認 / 証跡の保存" },
  { label: "tags", meaning: "検索・関連付け用のタグ", example: "該非判定 / キャッチオール規制" },
  { label: "relatedLinks", meaning: "関連ページへの内部リンク", example: "用語辞典・学習コンテンツへのリンク" },
];

export default function UpdatesPage() {
  return (
    <Shell
      title="規制アップデート"
      description="輸出管理・制裁・技術提供に関する最新の確認ポイントを、カテゴリ・地域・案件への影響つきで整理しています。"
    >
      <section className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200 sm:left-[19px]" aria-hidden="true" />
        <div className="grid gap-4">
          {REGULATION_ARTICLES.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="trade-hover-lift relative scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 pl-14 transition hover:border-brand-navy/30 sm:pl-16"
            >
              <span className="absolute left-[9px] top-8 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand-navy shadow-sm sm:left-[13px]" aria-hidden="true" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-blue-50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                        {item.category}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {item.region}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h2>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-navy">
                  {item.publishedAt}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-start gap-2">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.169 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs font-semibold text-amber-800">案件への影響</p>
                </div>
                <p className="mt-1 text-sm leading-7 text-amber-900">{item.impact}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">確認ポイント</p>
                <ul className="mt-2 space-y-2">
                  {item.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-500">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {item.relatedLinks.map((link) => (
                  <Link key={link.href + link.label} href={link.href} className="trade-secondary-button">
                    {link.label}
                  </Link>
                ))}
                <Link href="/ai-room" className="trade-primary-button">
                  AI相談室で確認する
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Article template</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">規制アップデート記事の執筆テンプレート</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          記事は以下のフィールドで構成します。正確性を重視し、不確実な情報や具体的な数値は載せない方針です。法令の解釈・適用は必ず公式情報でご確認ください。
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-2 pr-3 font-semibold text-slate-500">フィールド</th>
                <th className="py-2 pr-3 font-semibold text-slate-900">内容</th>
                <th className="py-2 font-semibold text-slate-900">記入例</th>
              </tr>
            </thead>
            <tbody>
              {templateFields.map((field) => (
                <tr key={field.label} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-3 font-mono text-xs text-brand-navy">{field.label}</td>
                  <td className="py-3 pr-3 text-slate-700">{field.meaning}</td>
                  <td className="py-3 text-slate-500">{field.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/glossary" className="trade-secondary-button">
            用語辞典で確認する
          </Link>
          <Link href="/learning" className="trade-secondary-button">
            学習コンテンツを見る
          </Link>
        </div>
      </section>
    </Shell>
  );
}
