"use client";

import { useMemo, useState } from "react";

type TermItem = { term: string; slug: string };

export function TermSearch({ items }: { items: TermItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return items
      .filter((item) => item.term.toLowerCase().includes(normalized))
      .slice(0, 12);
  }, [items, query]);

  return (
    <div className="rounded-xl border border-slate-200 bg-panel p-6">
      <h2 className="text-xl font-bold text-slate-900">掲載済み用語を検索</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        このページに掲載している用語を、キーワードで絞り込みます。掲載されていない用語や詳しい解説は、下の「AIで用語を質問する」からどうぞ。
      </p>

      <div className="mt-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例: 該非判定 / EAR / キャッチオール規制"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-500 focus:border-brand-navy"
        />
      </div>

      {query.trim() && (
        <div className="mt-3">
          {results.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {results.map((item) => (
                <li key={item.term}>
                  <a
                    href={`#${item.slug}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-navy/40 hover:text-brand-navy"
                  >
                    <span aria-hidden="true" className="text-brand-navy">→</span>
                    {item.term}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              「{query}」に一致する掲載用語はありません。下の「AIで用語を質問する」で質問してみてください。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
