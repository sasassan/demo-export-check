"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, message }),
      });

      if (response.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-bold text-emerald-800">送信しました</p>
        <p className="mt-2 text-sm leading-7 text-emerald-700">
          お問い合わせありがとうございます。確認後、ご連絡いたします。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          新しい問い合わせを送る
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">お名前 <span className="text-rose-500">*</span></span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="山田 太郎"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">メールアドレス <span className="text-rose-500">*</span></span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">企業名</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="株式会社〇〇"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">お問い合わせ内容 <span className="text-rose-500">*</span></span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="ご意見・ご要望・導入相談などをご記入ください"
          required
        />
      </label>

      {status === "error" && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          送信に失敗しました。しばらくしてから再度お試しください。
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-60"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
      <p className="text-xs leading-6 text-slate-500">
        送信された情報は問い合わせ対応のみに利用します。
      </p>
    </form>
  );
}
