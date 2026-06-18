"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { uploadImageAsDataUrl } from "@/lib/storage/upload";
import type { CreateCaseSchema } from "@/lib/validation/case";

const initialState: CreateCaseSchema = {
  productName: "",
  modelNumber: "",
  destinationCountry: "",
  customerCompanyName: "",
  productImageUrl: undefined,
};

const checkItems = [
  { icon: "🛡️", label: "制裁リスト" },
  { icon: "🔍", label: "エンドユーザー実在性" },
  { icon: "🏢", label: "UBO / PEPs" },
  { icon: "🌏", label: "国リスク" },
  { icon: "⚙️", label: "用途 / キャッチオール" },
  { icon: "📰", label: "ブランド毀損リスク" },
];

const quickSuggestions = [
  "工作機械 / サーボモーター / 半導体装置",
  "輸出先国の正式名称を入力",
  "顧客企業の英字表記も確認",
];

export function CaseForm({
  initialValues,
}: {
  initialValues?: Partial<CreateCaseSchema>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CreateCaseSchema>({
    ...initialState,
    ...initialValues,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const productImageUrl = await uploadImageAsDataUrl(file);
    setForm((current) => ({ ...current, productImageUrl }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { id?: string; error?: string };

      if (!response.ok || !payload.id) {
        throw new Error(payload.error ?? "案件登録に失敗しました。");
      }

      const investigationResponse = await fetch(`/api/investigations/${payload.id}/run`, {
        method: "POST",
      });

      if (!investigationResponse.ok) {
        const investigationPayload = (await investigationResponse.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(investigationPayload?.error ?? "AIスクリーニングの開始に失敗しました。");
      }

      router.push(`/cases/${payload.id}`);
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : "案件登録に失敗しました。",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<Key extends keyof CreateCaseSchema>(key: Key, value: CreateCaseSchema[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function runDiagnosis() {
    const messages: string[] = [];

    if (!form.productName.trim()) {
      messages.push("商品名が未入力です。用途が分かる商品名を入れると診断精度が上がります。");
    } else if (!/モーター|装置|部品|基板|センサー|機械|工具|材料/.test(form.productName)) {
      messages.push("商品名が抽象的です。型番や用途が伝わる表現を追加すると判定しやすくなります。");
    }

    if (!form.modelNumber.trim()) {
      messages.push("型番が未入力です。技術仕様に紐づく確認が弱くなるため、可能なら追加してください。");
    }

    if (!form.destinationCountry.trim()) {
      messages.push("輸出先国が未入力です。国リスク判定のため必須です。");
    }

    if (!form.customerCompanyName.trim()) {
      messages.push("顧客企業名が未入力です。実在性・制裁確認ができません。");
    }

    if (form.destinationCountry.includes("ロシア") || form.destinationCountry.includes("ミャンマー")) {
      messages.push("高リスク国の可能性があります。社内承認前提で制裁・用途確認を強化してください。");
    }

    if (!messages.length) {
      messages.push("入力内容は一次診断に進める水準です。次は案件登録してAIスクリーニングを実行してください。");
      if (!form.productImageUrl) {
        messages.push("商品画像を追加すると、社内共有時の識別性が上がります。");
      }
    }

    setDiagnosis(messages.join(" "));
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* 入力フォーム */}
      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-sky-50 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">AI入力診断</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">登録前に入力内容をクイックチェック</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                入力漏れや、追加で確認したいポイントをAI風のガイドとして表示します。
              </p>
            </div>
            <button
              type="button"
              onClick={runDiagnosis}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-md ring-1 ring-indigo-200 transition hover:bg-indigo-50"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.043a6.252 6.252 0 0 1 5.457 5.457h1.043a.75.75 0 0 1 0 1.5h-1.043a6.252 6.252 0 0 1-5.457 5.457v1.043a.75.75 0 0 1-1.5 0v-1.043a6.252 6.252 0 0 1-5.457-5.457H2.75a.75.75 0 0 1 0-1.5h1.043a6.252 6.252 0 0 1 5.457-5.457V2.75A.75.75 0 0 1 10 2Zm0 3.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z" clipRule="evenodd" />
              </svg>
              AI診断を試す
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickSuggestions.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300">
                {item}
              </span>
            ))}
          </div>
          {diagnosis ? (
            <div className="mt-4 rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
              {diagnosis}
            </div>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              商品名 <span className="text-rose-500">*</span>
            </span>
            <input
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-300 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={form.productName}
              onChange={(event) => updateField("productName", event.target.value)}
              placeholder="例: 高精度サーボモーター"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              型番 <span className="text-rose-500">*</span>
            </span>
            <input
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-300 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={form.modelNumber}
              onChange={(event) => updateField("modelNumber", event.target.value)}
              placeholder="例: SRV-9800"
              required
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              輸出先国 <span className="text-rose-500">*</span>
            </span>
            <input
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-300 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={form.destinationCountry}
              onChange={(event) => updateField("destinationCountry", event.target.value)}
              placeholder="例: ベトナム"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              顧客企業名 <span className="text-rose-500">*</span>
            </span>
            <input
              className="rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-300 transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={form.customerCompanyName}
              onChange={(event) => updateField("customerCompanyName", event.target.value)}
              placeholder="例: Saigon Precision Parts Ltd."
              required
            />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">商品画像（任意）</span>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 transition hover:bg-slate-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm text-slate-500">クリックして画像を選択</p>
            <p className="text-xs text-slate-400">PNG, JPG, GIF （最大 10MB）</p>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {form.productImageUrl ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Image
              src={form.productImageUrl}
              alt="商品画像プレビュー"
              width={1200}
              height={480}
              className="h-40 w-full object-cover"
              unoptimized
            />
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-700 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-indigo-300/20 transition hover:from-indigo-800 hover:to-sky-600 hover:shadow-xl disabled:opacity-60"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              確認中... しばらくお待ちください
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              案件を登録してAI確認を開始
            </>
          )}
        </button>
      </div>

      {/* サイドパネル */}
      <aside className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">入力のポイント</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            商品名だけでも開始できますが、型番・顧客名・輸出先国があるほど判定精度が上がります。
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">おすすめ入力順</p>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            <li>1. 商品名・型番を入力</li>
            <li>2. 輸出先国・顧客企業名を入力</li>
            <li>3. AI診断で不足情報を確認</li>
            <li>4. 案件登録してAI確認を開始</li>
          </ol>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700">確認対象の主な項目</h3>
          <ul className="mt-3 space-y-2">
            {checkItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="text-base">{item.icon}</span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-amber-50 px-4 py-3">
          <p className="text-xs leading-5 text-amber-800">
            本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
            最終的な輸出可否の判断は利用者自身の責任で実施してください。
          </p>
        </div>
      </aside>
    </form>
  );
}
