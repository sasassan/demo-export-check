"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { loginWithEmail, verifyLoginCode } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("demo@example.com");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await loginWithEmail(email);
      if (result?.verificationRequired) {
        setStage("code");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
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

  async function handleCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await verifyLoginCode(email, code, password || undefined);
      router.push("/dashboard");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "確認コードの検証に失敗しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (stage === "code") {
    return (
      <form onSubmit={handleCodeSubmit} className="flex flex-col gap-5">
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-900">{email}</span> 宛に確認コードを送信しました。メールに記載された6桁のコードを入力してください。
        </p>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">確認コード（6桁）</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
            placeholder="123456"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            管理者パスワード（管理者アカウントの場合のみ入力）
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
            placeholder="管理者以外は空欄のままで構いません"
          />
        </label>

        {error ? (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light disabled:opacity-60"
        >
          {isSubmitting ? "確認中..." : "コードを確認してログイン"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStage("email");
            setCode("");
            setError(null);
          }}
          className="text-xs font-medium text-slate-500 hover:underline"
        >
          メールアドレスを変更する
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">メールアドレス</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
          placeholder="you@example.com"
          required
        />
      </label>

      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            送信中...
          </>
        ) : (
          "確認コードを送信"
        )}
      </button>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">ログインに関する注意事項</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
        入力したメールアドレス宛に確認コードを送信します。コードを入力するとログインが完了します。
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-medium text-slate-600">
          <a href="/terms" className="inline-flex min-h-11 items-center px-2 text-brand-navy hover:underline">利用規約</a>
          <a href="/privacy" className="inline-flex min-h-11 items-center px-2 text-brand-navy hover:underline">プライバシーポリシー</a>
        </div>
      </div>
    </form>
  );
}
