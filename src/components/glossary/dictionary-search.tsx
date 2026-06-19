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
  const [allTerms, setAllTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, mode: "dictionary" }),
      });

      if (!response.ok) {
        throw new Error(`エラー (${response.status})`);
      }

      const data = await response.json();
      setAnswer(data.answer ?? null);
      if (data.allTerms) setAllTerms(data.allTerms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "検索に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-900">専門用語をAIで検索</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        例: インコタームズ / EAR / ECCN / UBO / キャッチオール規制 / 該非判定
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="調べたい用語を入力（Enterで検索）"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-[#1e3a5f]"
        />
        <button type="button" onClick={handleSearch} disabled={loading}
          className="trade-primary-button disabled:opacity-50">
          {loading ? "検索中..." : "AIで解説する"}
        </button>
      </div>

      {/* Quick term buttons */}
      {allTerms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {allTerms.slice(0, 12).map((term) => {
            const short = term.split("（")[0];
            return (
              <button key={term} type="button"
                onClick={() => { setQuery(short); }}
                className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 hover:border-slate-300 hover:text-[#1e3a5f]">
                {short}
              </button>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !answer && (
        <div className="mt-5 animate-pulse space-y-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/70 p-5">
          <div className="h-6 w-48 rounded-lg bg-slate-200" />
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 rounded-xl bg-white/80 p-4">
                <div className="h-4 w-24 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-3/4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="mt-5 space-y-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/70 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e3a5f]">Dictionary answer</p>
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
                  <Link key={item.href + item.label} href={item.href}
                    className="rounded-lg bg-gradient-to-r from-[#1e3a5f] to-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-sm">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">参考リンク</p>
              <div className="mt-3 space-y-2">
                {answer.referenceLinks.length > 0 ? answer.referenceLinks.map((item) => (
                  <a key={item.href} href={item.href} target="_blank" rel="noreferrer"
                    className="block text-sm font-medium text-[#1e3a5f] hover:text-[#2a4a73]">
                    {item.label}
                  </a>
                )) : <p className="text-sm text-slate-500">参考リンクはありません。</p>}
              </div>
            </div>
          </div>

          {/* AI consultation link */}
          <div className="rounded-xl border border-slate-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-slate-900">この用語についてもっと詳しく知りたい場合</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/ai-room`} className="rounded-lg bg-[#1e3a5f] px-3 py-2 text-xs font-semibold !text-white hover:bg-[#2a4a73]">
                AI相談室で深掘りする
              </Link>
              <Link href="/learning" className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300">
                学習コンテンツを見る
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
