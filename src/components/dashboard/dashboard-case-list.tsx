"use client";

import { useMemo, useState } from "react";

import { CaseSummaryCard } from "@/components/cases/case-summary-card";
import type { CaseRecord } from "@/lib/types";

type SortKey = "updated-desc" | "updated-asc" | "name-asc";

const statusOptions = [
  { value: "all", label: "すべて" },
  { value: "investigating", label: "AI確認中" },
  { value: "completed", label: "調査完了" },
  { value: "failed", label: "エラー" },
  { value: "draft", label: "下書き" },
] as const;

export function DashboardCaseList({ items }: { items: CaseRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]["value"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated-desc");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const nextItems = items.filter((item) => {
      const matchesStatus = status === "all" ? true : item.status === status;

      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : [
              item.productName,
              item.modelNumber,
              item.customerCompanyName,
              item.destinationCountry,
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });

    nextItems.sort((left, right) => {
      if (sortKey === "updated-asc") {
        return left.updatedAt.localeCompare(right.updatedAt);
      }

      if (sortKey === "name-asc") {
        return left.productName.localeCompare(right.productName, "ja");
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });

    return nextItems;
  }, [items, query, sortKey, status]);

  return (
    <section className="grid gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">案件を検索</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="商品名・型番・顧客名・輸出先国で検索"
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">ステータス</span>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof statusOptions)[number]["value"])
              }
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">並び順</span>
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
            >
              <option value="updated-desc">更新日が新しい順</option>
              <option value="updated-asc">更新日が古い順</option>
              <option value="name-asc">商品名順</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            表示件数 <span className="font-semibold text-slate-900">{filteredItems.length}</span> /{" "}
            {items.length} 件
          </p>
          {(query || status !== "all" || sortKey !== "updated-desc") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("all");
                setSortKey("updated-desc");
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              条件をリセット
            </button>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">条件に一致する案件がありません</p>
          <p className="mt-2 text-sm text-slate-500">
            検索キーワードまたはステータス条件を変更してください。
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredItems.map((item) => (
            <CaseSummaryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}