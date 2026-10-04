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
  { icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.955 11.955 0 0 0 3 10.5c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Z", label: "制裁リスト" },
  { icon: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z", label: "エンドユーザー実在性" },
  { icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21", label: "UBO / PEPs" },
  { icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A8.959 8.959 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418", label: "国リスク" },
  { icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z", label: "用途 / キャッチオール規制" },
  { icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z", label: "ブランド毀損リスク" },
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
      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-panel p-6 shadow-xl shadow-black/30">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-tint-blue to-tint-sky p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">AI入力診断</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">登録前に入力内容をクイックチェック</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                入力漏れや、追加で確認したいポイントをAI風のガイドとして表示します。
              </p>
            </div>
            <button
              type="button"
              onClick={runDiagnosis}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-panel px-4 py-2 text-sm font-semibold text-brand-navy shadow-md ring-1 ring-slate-200 transition hover:bg-tint-blue"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.043a6.252 6.252 0 0 1 5.457 5.457h1.043a.75.75 0 0 1 0 1.5h-1.043a6.252 6.252 0 0 1-5.457 5.457v1.043a.75.75 0 0 1-1.5 0v-1.043a6.252 6.252 0 0 1-5.457-5.457H2.75a.75.75 0 0 1 0-1.5h1.043a6.252 6.252 0 0 1 5.457-5.457V2.75A.75.75 0 0 1 10 2Zm0 3.25a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5Z" clipRule="evenodd" />
              </svg>
              AI診断を試す
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickSuggestions.map((item) => (
              <span key={item} className="rounded-full bg-panel px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-300">
                {item}
              </span>
            ))}
          </div>
          {diagnosis ? (
            <div
              role="status"
              className="mt-4 rounded-xl border border-slate-200 bg-panel px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm"
            >
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
              className="rounded-xl border-2 border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
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
              className="rounded-xl border-2 border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
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
              className="rounded-xl border-2 border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
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
              className="rounded-xl border-2 border-slate-300 bg-panel px-4 py-3 text-sm text-slate-900 outline-none ring-blue-200 transition placeholder:text-slate-500 focus:border-brand-navy focus:ring-4 focus:ring-blue-100"
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <p className="text-sm text-slate-500">クリックして画像を選択</p>
            <p className="text-xs text-slate-500">PNG, JPG, GIF （最大 10MB）</p>
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
          <div role="alert" className="flex items-start gap-3 rounded-xl bg-tint-rose px-4 py-3 text-sm text-rose-400">
            <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-deep-light disabled:opacity-60"
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
      <aside className="grid gap-5 rounded-2xl border border-slate-200 bg-panel p-6">
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
          <ul className="mt-3 space-y-2.5">
            {checkItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tint-blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-tint-amber px-4 py-3">
          <p className="text-xs leading-5 text-amber-300">
            本サービスは参考情報を提供するものであり、法令上の判断を代替するものではありません。
            最終的な輸出可否の判断は利用者自身の責任で実施してください。
          </p>
        </div>
      </aside>
    </form>
  );
}
