"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";

const PURPOSE_OPTIONS = ["導入相談", "デモ依頼", "研修・教育相談", "フィードバック", "NDA・セキュリティ相談", "その他"] as const;

function resolveInitialPurpose(v: string | null): string {
  // 研修ページ（/training の「研修について相談する」→ /contact?v=training）から
  // 遷移した場合は「研修・教育相談」を初期選択し、それ以外は従来通り「導入相談」。
  return v === "training" ? "研修・教育相談" : "導入相談";
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [purpose, setPurpose] = useState<string>(() =>
    resolveInitialPurpose(searchParams.get("v")),
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorDetail(null);

    // 送信処理が応答なしで固まらないようタイムアウトを設ける。
    // fail-closed（本番でResend未設定時は503）を含め、何らかの応答が返れば
    // その内容を画面に反映する。タイムアウト時は通信エラーとして扱う。
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, name, email, company, message }),
        signal: controller.signal,
      });

      if (response.ok) {
        setStatus("sent");
        setPurpose(resolveInitialPurpose(searchParams.get("v")));
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      } else {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorDetail(payload?.error ?? null);
        setStatus("error");
      }
    } catch {
      setErrorDetail(null);
      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-tint-emerald-border bg-tint-emerald p-6 text-center">
        <p className="text-lg font-bold text-emerald-400">送信しました</p>
        <p className="mt-2 text-sm leading-7 text-emerald-400">
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
          className="rounded-xl border border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-navy focus:ring-2 focus:ring-blue-100"
          required
        >
          {PURPOSE_OPTIONS.map((item) => (
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
          className="rounded-xl border border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-navy focus:ring-2 focus:ring-blue-100"
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
          className="rounded-xl border border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-navy focus:ring-2 focus:ring-blue-100"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">企業名</span>
        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="rounded-xl border border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-navy focus:ring-2 focus:ring-blue-100"
          placeholder="株式会社〇〇"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-800">お問い合わせ内容 <span className="text-rose-500">*</span></span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
          className="rounded-xl border border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none focus:border-brand-navy focus:ring-2 focus:ring-blue-100"
          placeholder="背景、課題、相談したい内容、希望時期などをご記入ください"
          required
        />
      </label>

      {status === "error" && (
        <div role="alert" className="rounded-xl border border-tint-rose-border bg-tint-rose px-4 py-3 text-sm text-rose-400">
          <p className="font-semibold">送信に失敗しました。</p>
          <p className="mt-1">
            {errorDetail ?? "しばらくしてから再度お試しください。"}
          </p>
          <p className="mt-1">
            入力内容は保持されています。修正して再度「送信する」を押すと再試行できます。
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-deep-light disabled:opacity-60"
      >
        {status === "sending" && <Spinner className="h-4 w-4" />}
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
      <p className="text-xs leading-6 text-slate-500">
        送信された情報は問い合わせ対応のみに利用します。機密情報や未公開技術情報の送信は避け、必要に応じて匿名化してください。
      </p>
    </form>
  );
}
