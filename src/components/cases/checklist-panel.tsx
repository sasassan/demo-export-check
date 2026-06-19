"use client";

import { useMemo, useState, useTransition } from "react";

import type { ChecklistItem } from "@/lib/types";

export function ChecklistPanel({
  caseId,
  initialItems,
}: {
  caseId: string;
  initialItems: ChecklistItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const progress = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((items.filter((item) => item.completed).length / items.length) * 100);
  }, [items]);

  function updateChecklist(nextItems: ChecklistItem[]) {
    setItems(nextItems);
    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklist: nextItems }),
      });

      if (!response.ok) {
        setError("チェックリストの保存に失敗しました。");
      }
    });
  }

  function toggleItem(targetId: string) {
    const nextItems = items.map((item) =>
      item.id === targetId ? { ...item, completed: !item.completed } : item,
    );

    updateChecklist(nextItems);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">確認チェックリスト</h2>
          <p className="mt-1 text-sm text-slate-500">
            案件ごとに必要な確認項目を進捗付きで管理できます。
          </p>
        </div>
        <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm sm:w-auto sm:min-w-36">
          <p className="text-slate-500">進捗</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{progress}%</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/60">
        <div className="h-full rounded-full bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-blue-50/60"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
            />
            <span className={item.completed ? "text-sm text-slate-500 line-through" : "text-sm text-slate-900"}>
              {item.label}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {isPending ? "保存中..." : "変更は自動保存されます。"}
        </p>
        {error ? <p className="text-xs text-rose-500">{error}</p> : null}
      </div>
    </section>
  );
}