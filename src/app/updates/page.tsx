import Link from "next/link";

import { Shell } from "@/components/layout/shell";
import { REGULATION_UPDATES } from "@/lib/regulation-updates";

export const dynamic = "force-static";

export default function UpdatesPage() {
  return (
    <Shell
      title="規制アップデート"
      description="輸出管理・制裁・技術提供に関する最新の確認ポイントを、案件判断に活かしやすい形で整理しています。"
    >
      <section className="grid gap-4">
        {REGULATION_UPDATES.map((item) => (
          <article
            key={`${item.title}-${item.publishedAt}`}
            className="rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1e3a5f]">
                  Regulation update
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{item.title}</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1e3a5f]">
                {item.publishedAt}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{item.summary}</p>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-800">案件への影響</p>
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
      </section>
    </Shell>
  );
}