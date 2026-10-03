import Link from "next/link";

import { Shell } from "@/components/layout/shell";
import { REGULATION_UPDATES } from "@/lib/regulation-updates";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "輸出規制アップデート",
  description:
    "輸出管理・制裁・キャッチオール規制・技術提供に関する最新の規制アップデートと確認ポイントを、案件判断に活かしやすい形で整理して紹介します。",
  path: "/updates",
});

export default function UpdatesPage() {
  return (
    <Shell
      title="規制アップデート"
      description="輸出管理・制裁・技術提供に関する最新の確認ポイントを、案件判断に活かしやすい形で整理しています。"
    >
      <section className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200 sm:left-[19px]" aria-hidden="true" />
        <div className="grid gap-4">
          {REGULATION_UPDATES.map((item) => (
            <article
              key={`${item.title}-${item.publishedAt}`}
              className="trade-hover-lift relative rounded-xl border border-slate-200 bg-white p-6 pl-14 transition hover:border-brand-navy/30 sm:pl-16"
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
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-navy">
                      Regulation update
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h2>
                  </div>
                </div>
                <span className="rounded-full border border-slate-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-navy">
                  <span className="font-bold text-brand-navy">{item.publishedAt}</span>
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
              <div className="mt-4 flex flex-wrap gap-3">
                {item.href ? (
                  <Link href={item.href} className="trade-secondary-button">
                    関連ページを見る
                  </Link>
                ) : null}
                <Link href="/ai-room" className="trade-primary-button">
                  AI相談室で確認する
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}