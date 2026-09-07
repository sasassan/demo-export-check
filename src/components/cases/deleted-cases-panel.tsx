"use client";

import { useMemo, useState } from "react";

import { CASE_DELETION_GRACE_PERIOD_DAYS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { DeletedCaseRecord } from "@/lib/types";

function daysRemaining(deletedAt: string): number {
  const elapsedMs = Date.now() - new Date(deletedAt).getTime();
  const remainingMs = CASE_DELETION_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000 - elapsedMs;
  return Math.max(0, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}

export function DeletedCasesPanel({
  items,
  showOwner = false,
}: {
  items: DeletedCaseRecord[];
  /** 管理者画面など、複数ユーザーの案件をまとめて表示する場合に所有者メールを表示する */
  showOwner?: boolean;
}) {
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoredIds, setRestoredIds] = useState<Set<string>>(new Set());
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  const visibleItems = useMemo(
    () => items.filter((item) => !restoredIds.has(item.id)),
    [items, restoredIds],
  );

  async function handleRestore(caseId: string) {
    if (restoringId) return;
    setRestoringId(caseId);
    setErrorById((prev) => ({ ...prev, [caseId]: "" }));

    try {
      const response = await fetch(`/api/cases/${caseId}/restore`, { method: "POST" });

      if (!response.ok) {
        const message =
          response.status === 410
            ? "猶予期間を過ぎているため復元できません。"
            : response.status === 403
              ? "この案件を復元する権限がありません。"
              : "復元に失敗しました。時間をおいて再度お試しください。";
        setErrorById((prev) => ({ ...prev, [caseId]: message }));
        return;
      }

      setRestoredIds((prev) => new Set(prev).add(caseId));
    } catch {
      setErrorById((prev) => ({
        ...prev,
        [caseId]: "復元に失敗しました。時間をおいて再度お試しください。",
      }));
    } finally {
      setRestoringId(null);
    }
  }

  if (visibleItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-8 text-center">
        <p className="text-sm text-slate-500">削除済みの案件はありません。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {visibleItems.map((item) => {
        const remaining = daysRemaining(item.deletedAt);
        const isExpired = remaining <= 0;

        return (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">{item.productName}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  削除済み
                </span>
                {isExpired ? (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700">
                    猶予期間終了
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    残り{remaining}日で復元不可
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>型番: {item.modelNumber}</span>
                <span className="hidden sm:inline">·</span>
                <span>顧客: {item.customerCompanyName}</span>
                {showOwner ? (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span>作成者: {item.userEmail}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-slate-400">削除日時: {formatDate(item.deletedAt)}</p>
              {errorById[item.id] ? (
                <p className="mt-1 text-xs text-rose-600">{errorById[item.id]}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => handleRestore(item.id)}
              disabled={restoringId === item.id || isExpired}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm4.75 4.75a.75.75 0 0 0-1.5 0v3.19L6.03 9.22a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 1 0-1.06-1.06l-1.72 1.72V6.75Z"
                  clipRule="evenodd"
                />
              </svg>
              {restoringId === item.id ? "復元中..." : isExpired ? "復元不可" : "復元する"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
