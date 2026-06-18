"use client";

import { useState } from "react";
import Link from "next/link";

type Answer = {
  title: string;
  simpleExplanation: string;
  practicalUse: string;
  caution: string;
  relatedRisk: string;
  relatedFeatures: { label: string; href: string }[];
  referenceLinks: { label: string; href: string }[];
};

export function DictionarySearch() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer(null);

    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query, mode: "dictionary" }),
    });

    const data = await response.json();
    setAnswer(data.answer ?? null);
    setLoading(false);
  };

  return (
    <div className="trade-glass-card rounded-[1.75rem] p-6">
      <h2 className="text-xl font-bold text-slate-900">専門用語をAIで検索</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        例: インコタームズ / EAR / ECCN / UBO / PEPs
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="調べたい用語を入力"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-400"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="trade-primary-button"
        >
          {loading ? "検索中..." : "AIで解説する"}
        </button>
      </div>

      {answer && (
        <div className="mt-5 space-y-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Dictionary answer</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">{answer.title}</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">簡単な説明</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.simpleExplanation}</p>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">実務で使う場面</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.practicalUse}</p>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">注意点</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.caution}</p>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">関連する輸出リスク</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.relatedRisk}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">関連機能へ移動</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {answer.relatedFeatures.map((item) => (
                  <Link key={item.href + item.label} href={item.href} className="rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">参考リンク</p>
              <div className="mt-3 space-y-2">
                {answer.referenceLinks.length > 0 ? answer.referenceLinks.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="block text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    {item.label}
                  </a>
                )) : <p className="text-sm text-slate-500">参考リンクはありません。</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
