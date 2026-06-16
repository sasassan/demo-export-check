"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginWithEmail } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await loginWithEmail(email);
      router.push("/dashboard");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "ログインに失敗しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">メールアドレス</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-cyan-300 transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          placeholder="you@example.com"
          required
        />
      </label>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-300/20 transition hover:from-indigo-800 hover:to-sky-600 hover:shadow-xl disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            ログイン中...
          </>
        ) : (
          "メールでログイン"
        )}
      </button>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200/70">Login note</p>
        <p className="mt-2 text-xs leading-6 text-slate-600">
        初期版ではメールを入力するとそのまま利用開始できます。将来的に Magic Link に置き換えやすい構成です。
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
          <a href="/terms" className="text-indigo-700 hover:underline">利用規約</a>
          <a href="/privacy" className="text-indigo-700 hover:underline">プライバシーポリシー</a>
        </div>
      </div>
    </form>
  );
}
