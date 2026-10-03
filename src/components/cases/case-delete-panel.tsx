"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function CaseDeletePanel({
  caseId,
  productName,
}: {
  caseId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const canConfirm = confirmText.trim() === productName;

  function openDialog() {
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    setConfirmText("");
    setError(null);
    triggerRef.current?.focus();
  }

  // モーダル表示中は Escape で閉じ、Tab フォーカスをダイアログ内に閉じ込める
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  async function handleDelete() {
    if (!canConfirm || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/cases/${caseId}`, { method: "DELETE" });

      if (!response.ok) {
        setError(
          response.status === 403
            ? "この案件を削除する権限がありません。"
            : "削除に失敗しました。時間をおいて再度お試しください。",
        );
        setIsSubmitting(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("削除に失敗しました。時間をおいて再度お試しください。");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-rose-900">この案件を削除</h2>
          <p className="mt-1 text-sm text-rose-700">
            削除しても30日間は復元可能です。相談履歴（AI相談）は削除されず、独立した資産として残ります。
          </p>
        </div>
        <button
          type="button"
          ref={triggerRef}
          onClick={openDialog}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-3 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
          案件を削除する
        </button>
      </div>

      {isOpen ? (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
              本当に削除しますか？
            </h3>
            <p id="delete-dialog-description" className="mt-2 text-sm leading-6 text-slate-600">
              この操作は取り消せません（30日以内は本人・管理者による復元が可能です）。
              続行するには、案件名 <span className="font-semibold text-slate-900">「{productName}」</span>{" "}
              を正確に入力してください。
            </p>

            <label htmlFor="delete-confirm-input" className="sr-only">
              削除する案件名を入力
            </label>
            <input
              id="delete-confirm-input"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={productName}
              aria-describedby={
                error ? "delete-dialog-error delete-dialog-description" : "delete-dialog-description"
              }
              className="mt-4 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-rose-200 transition placeholder:text-slate-500 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              autoFocus
            />

            {error ? (
              <p id="delete-dialog-error" role="alert" className="mt-3 text-sm text-rose-600">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canConfirm || isSubmitting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
