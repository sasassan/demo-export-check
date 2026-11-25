"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GlossaryTerm = {
  term: string;
  full?: string;
  category: string;
  description: string;
  example?: string;
  related?: string[];
};

function slugify(term: string): string {
  return term
    .toLowerCase()
    .replace(/（.*?）|\(.*?\)/g, "")
    .replace(/[・、。／]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function GlossaryTermList({
  terms,
  categories,
}: {
  terms: GlossaryTerm[];
  categories: readonly string[];
}) {
  const [query, setQuery] = useState("");

  const slugMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of terms) {
      map.set(item.term, slugify(item.term));
    }
    return map;
  }, [terms]);

  const normalized = query.trim().toLowerCase();
  const filteredTerms = useMemo(() => {
    if (!normalized) return terms;
    return terms.filter(
      (item) =>
        item.term.toLowerCase().includes(normalized) ||
        (item.full ?? "").toLowerCase().includes(normalized),
    );
  }, [terms, normalized]);

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-panel p-6">
        <h2 className="text-xl font-bold text-slate-900">掲載済み用語を検索</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          このページに掲載している用語を、キーワードで絞り込みます。掲載されていない用語や詳しい解説は、下の「AIで用語を質問する」からどうぞ。
        </p>

        <div className="mt-4">
          <div className="relative">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例: 該非判定 / EAR / キャッチオール規制"
              aria-label="掲載用語を検索"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-brand-navy"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="検索をクリア"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                クリア
              </button>
            )}
          </div>
        </div>
      </div>

      {normalized && filteredTerms.length === 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-panel p-8 text-center">
          <p className="text-base font-semibold text-slate-900">
            「{query}」に一致する掲載用語はありません
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            掲載されていない用語や詳しい解説は、下の「AIで用語を質問する」から調べられます。
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-lg border border-slate-300 bg-panel px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            検索をクリアして一覧を表示
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {categories.map((category) => {
            const categoryTerms = filteredTerms.filter((t) => t.category === category);
            if (categoryTerms.length === 0) return null;
            return (
              <section key={category} id={slugify(category)} className="scroll-mt-24">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900">{category}</h2>
                  <span className="rounded-full border border-slate-200 bg-tint-blue px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                    {categoryTerms.length}件
                  </span>
                </div>
                <div className="space-y-4">
                  {categoryTerms.map((item) => (
                    <div
                      key={item.term}
                      id={slugMap.get(item.term)}
                      className="trade-hover-lift scroll-mt-24 border border-slate-200 bg-panel rounded-xl p-6 transition hover:border-brand-navy/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-tint-blue">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-brand-navy">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-black text-slate-900">{item.term}</h3>
                              <span className="rounded-full border border-slate-200 bg-tint-blue px-2.5 py-0.5 text-xs font-medium text-brand-navy">
                                {item.category}
                              </span>
                            </div>
                            {item.full && (
                              <p className="mt-0.5 text-sm text-slate-500">{item.full}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>

                      {item.example && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 mt-3 flex items-start gap-2 px-3 py-2">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold text-brand-navy flex-shrink-0 mt-0.5">
                            活用例
                          </span>
                          <p className="text-xs text-slate-600">{item.example}</p>
                        </div>
                      )}

                      {item.related && item.related.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">関連用語:</span>
                          {item.related.map((relatedTerm) => {
                            const slug = slugMap.get(relatedTerm);
                            if (!slug) return null;
                            return (
                              <Link
                                key={relatedTerm}
                                href={`#${slug}`}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-brand-navy hover:border-brand-navy/40 hover:bg-tint-blue"
                              >
                                {relatedTerm}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
