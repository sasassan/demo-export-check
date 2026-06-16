"use client";

import { useMemo, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Export Risk Navigator AI β版への問い合わせ");
    const body = encodeURIComponent(
      `お名前: ${name}\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`,
    );
    return `mailto:demo-export-check@example.com?subject=${subject}&body=${body}`;
  }, [email, message, name]);

  return (
    <form className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">お名前</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500"
          placeholder="山田 太郎"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">メールアドレス</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500"
          placeholder="you@example.com"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">お問い合わせ内容</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500"
          placeholder="ご意見・ご要望・フィードバックをご記入ください"
        />
      </label>
      <a
        href={mailtoHref}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
      >
        メールアプリで送信する
      </a>
      <p className="text-xs leading-6 text-slate-500">
        β版では問い合わせフォームはメール送信連携で提供しています。送信先アドレスは本番公開時に正式な窓口へ差し替えてください。
      </p>
    </form>
  );
}