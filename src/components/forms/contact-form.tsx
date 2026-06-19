"use client";

import { useState } from "react";

export function ContactForm() {
  const [purpose, setPurpose] = useState("導入相談");
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
        body: JSON.stringify({ purpose, name, email, company, message }),
      });

      if (response.ok) {
        setStatus("sent");
        setPurpose("導入相談");
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
          お問い合わせありがとうございます。内容を確認し、原則1営業日以内を目安に一次返信いたします。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 rounded-xl bg-emerald-700 px-5 py-2 text-sm font-semibold !text-white hover:bg-emerald-800"
        >
          新しい問い合わせを送る
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">お問い合わせ種別 <span className="text-rose-500">*</span></span>
        <select
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-100"
          required
        >
          {["導入相談", "デモ依頼", "フィードバック", "NDA・セキュリティ相談", "その他"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">お名前 <span className="text-rose-500">*</span></span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-100"
          placeholder="山田 太郎"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">メールアドレス <span className="text-rose-500">*</span></span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-100"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">企業名</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-100"
          placeholder="株式会社〇〇"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">お問い合わせ内容 <span className="text-rose-500">*</span></span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-blue-100"
          placeholder="背景、課題、相談したい内容、希望時期などをご記入ください"
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
        className="inline-flex items-center justify-center rounded-xl bg-[#1e3a5f] px-5 py-3 text-sm font-semibold !text-white shadow-sm hover:bg-[#2a4a73] disabled:opacity-60"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
      <p className="text-xs leading-6 text-slate-500">
        送信された情報は問い合わせ対応のみに利用します。機密情報や未公開技術情報の送信は避け、必要に応じて匿名化してください。
      </p>
    </form>
  );
}
