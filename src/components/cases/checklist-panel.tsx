"use client";

import { useMemo, useState, useTransition } from "react";

import { ClipboardPenIcon } from "@/components/icons/trade-icons";
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
    <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tint-amber text-amber-400">
            <ClipboardPenIcon aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">確認チェックリスト</h2>
            <p className="mt-1 text-sm text-slate-500">
              案件ごとに必要な確認項目を進捗付きで管理できます。
            </p>
          </div>
        </div>
        <div className="w-full rounded-xl border border-slate-200 bg-panel px-4 py-3 text-sm sm:w-auto sm:min-w-36">
          <p className="text-slate-500">進捗</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{progress}%</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/60">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-deep to-brand-navy-light transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-panel px-4 py-3 transition hover:border-slate-300 hover:bg-tint-blue/60"
          >
            <span className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="h-5 w-5 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
              />
            </span>
            <span className={item.completed ? "text-base text-slate-500 line-through" : "text-base text-slate-900"}>
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