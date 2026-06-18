"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Answer = {
  title: string;
  caseDraft?: {
    productName?: string;
    modelNumber?: string;
    destinationCountry?: string;
    customerCompanyName?: string;
  };
  sourceMeta?: {
    urlFetchStatus?: "success" | "failed" | "not_requested";
    fetchedExcerpt?: string;
  };
  simpleExplanation: string;
  practicalUse: string;
  caution: string;
  relatedRisk: string;
  relatedFeatures: { label: string; href: string }[];
  extractedPoints?: string[];
  judgement?: string;
  recommendedChecks?: string[];
};

const EXAMPLES = [
  "この商品をベトナムへ輸出したい。何を確認すべき？",
  "EARって初心者向けにいうと何？",
  "この資料の内容が自社輸出に関係あるか判断したい",
  "相手先企業が怪しい時、最初に見るポイントは？",
  "インコタームズと契約条件の関係を初心者向けに知りたい",
];

const MODES = [
  {
    value: "general",
    label: "通常相談",
    description: "輸出に関する疑問をそのまま相談",
  },
  {
    value: "beginner-explain",
    label: "初心者向けに説明",
    description: "専門資料や文章をやさしく言い換え",
  },
  {
    value: "relevance-check",
    label: "自社輸出への関係を判断",
    description: "資料が自社輸出に関係あるかを整理",
  },
  {
    value: "document-read",
    label: "資料読解補助",
    description: "貼り付けた文章の要点・確認点を抽出",
  },
] as const;

export function AiRoomPanel() {
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("general");
  const [message, setMessage] = useState(EXAMPLES[0]);
  const [sourceText, setSourceText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSavedMessage, setLastSavedMessage] = useState("");

  const selectedMode = MODES.find((item) => item.value === mode)!;
  const sourceTextLength = sourceText.trim().length;

  const quickTemplates = useMemo(
    () => [
      {
        label: "初めての輸出",
        message: "初めて海外取引をする予定です。営業担当として最初に何を確認すべきですか？",
        mode: "general" as const,
      },
      {
        label: "規制資料をやさしく",
        message: "この資料を初心者向けに説明してください。",
        mode: "beginner-explain" as const,
      },
      {
        label: "自社に関係あるか",
        message: "この文章が自社輸出に関係あるか判断したいです。",
        mode: "relevance-check" as const,
      },
      {
        label: "資料の要点整理",
        message: "この資料の要点と次に確認すべき点を整理してください。",
        mode: "document-read" as const,
      },
    ],
    [],
  );

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    setPdfStatus("reading");

    try {
      const { extractTextFromPdfFile } = await import("@/lib/pdf/extract-client");
      const extracted = await extractTextFromPdfFile(file);
      setSourceText((current) => (current ? `${current}\n\n${extracted}` : extracted));
      setPdfStatus("done");
    } catch {
      setPdfStatus("error");
    }
  };

  const handleTemplateClick = (template: (typeof quickTemplates)[number]) => {
    setMode(template.mode);
    setMessage(template.message);
  };

  const handleReset = () => {
    setMessage("");
    setSourceText("");
    setSourceUrl("");
    setPdfFileName("");
    setPdfStatus("idle");
    setAnswer(null);
  };

  const submit = async () => {
    if (!message.trim() && !sourceText.trim()) return;
    setLoading(true);
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        mode,
        sourceText,
        sourceUrl,
      }),
    });
    const data = await response.json();
    setAnswer(data.answer ?? null);
    setLastSavedMessage(message || "（資料読解のみ）");
    setLoading(false);
  };

  return (
    <div className="trade-glass-card rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">AI consultation</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">AI相談室</h2>
        </div>
        <Link href="/demo" className="trade-secondary-button !px-4 !py-2 !text-sm">
          デモを見る
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
        <p className="text-sm font-semibold text-slate-900">テンプレートから始める</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => handleTemplateClick(template)}
              className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-400"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
        <p className="text-sm font-semibold text-slate-900">相談モード</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setMode(item.value)}
              className={`rounded-xl border px-4 py-3 text-left ${
                mode === item.value
                  ? "border-cyan-300 bg-white shadow-sm"
                  : "border-indigo-100 bg-white/75"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
        <p className="text-sm font-semibold text-slate-900">質問例</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMessage(item)}
              className="rounded-full border border-indigo-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-indigo-400"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-slate-900">質問内容</label>
            <span className="text-xs text-slate-500">{message.trim().length}文字</span>
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
            placeholder="輸出について不安なこと、資料の意味、規制の見方などを入力してください"
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">参考URL（任意）</label>
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
              placeholder="https://example.com/regulation"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-sm font-semibold text-slate-900">資料本文・抜粋（任意）</label>
              <span className="text-xs text-slate-500">{sourceTextLength}文字</span>
            </div>
            <textarea
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              rows={5}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
              placeholder="他サイトの記事、規制資料、PDFからコピーした文章をここに貼り付けてください"
            />
            <div className="mt-3 rounded-2xl border border-dashed border-cyan-300/60 bg-cyan-50/70 p-4">
              <label className="block text-sm font-semibold text-slate-900">PDFアップロード</label>
              <p className="mt-1 text-xs leading-6 text-slate-600">PDFを選ぶと本文を抽出して資料欄へ追加します。</p>
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {pdfFileName ? (
                <p className="mt-2 text-xs text-slate-600">
                  {pdfFileName} / {pdfStatus === "reading" ? "抽出中" : pdfStatus === "done" ? "抽出完了" : pdfStatus === "error" ? "抽出失敗" : "待機中"}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/80 px-4 py-3 text-xs leading-6 text-indigo-800">
          <span className="font-semibold">現在のモード:</span> {selectedMode.label} — {selectedMode.description}
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/90 px-4 py-3 text-xs leading-6 text-cyan-900">
          URLを入力すると、本文を自動取得できる場合はその内容も読解に利用します。取得できないサイトでは、貼り付けた本文が優先して使われます。
        </div>

        {lastSavedMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-6 text-emerald-800">
            直近の相談履歴保存対象: {lastSavedMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={submit} className="trade-primary-button">
            {loading ? "回答を整理中..." : "AIに質問する"}
          </button>
          <button type="button" onClick={handleReset} className="trade-secondary-button">
            入力をリセット
          </button>
        </div>
      </div>

      {answer && (
        <div className="mt-5 space-y-3 rounded-2xl border border-cyan-100 bg-gradient-to-br from-slate-50 to-cyan-50/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">{answer.title}</h3>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              回答生成済み
            </span>
          </div>
          <div className="trade-soft-block p-4">
            <p className="text-sm font-semibold text-slate-900">初心者向けの説明</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{answer.simpleExplanation}</p>
          </div>

          {(answer.extractedPoints?.length || answer.recommendedChecks?.length || answer.judgement) && (
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="trade-soft-block p-4">
                <p className="text-sm font-semibold text-slate-900">要点整理</p>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600">
                  {(answer.extractedPoints ?? []).map((point) => (
                    <li key={point}>・{point}</li>
                  ))}
                </ul>
              </div>
              <div className="trade-soft-block p-4">
                <p className="text-sm font-semibold text-slate-900">自社輸出への関係</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{answer.judgement ?? "該当性判断なし"}</p>
              </div>
              <div className="trade-soft-block p-4">
                <p className="text-sm font-semibold text-slate-900">次に確認すべき点</p>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600">
                  {(answer.recommendedChecks ?? []).map((point) => (
                    <li key={point}>・{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-3">
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">実務で見る点</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.practicalUse}</p>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">注意点</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.caution}</p>
            </div>
            <div className="trade-soft-block p-4">
              <p className="text-sm font-semibold text-slate-900">関連リスク</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.relatedRisk}</p>
            </div>
          </div>
          {answer.sourceMeta && (
            <div className="trade-soft-block p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">回答の根拠</p>
              <p className="mt-2">
                URL取得状態: {answer.sourceMeta.urlFetchStatus === "success" ? "取得成功" : answer.sourceMeta.urlFetchStatus === "failed" ? "取得失敗" : "未指定"}
              </p>
              {answer.sourceMeta.fetchedExcerpt ? (
                <p className="mt-2">取得本文冒頭: {answer.sourceMeta.fetchedExcerpt}...</p>
              ) : null}
            </div>
          )}

          {answer.caseDraft && (
            <div className="trade-soft-block p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">案件化候補データ</p>
              <p className="mt-2">商品名: {answer.caseDraft.productName || "-"}</p>
              <p>型番: {answer.caseDraft.modelNumber || "-"}</p>
              <p>輸出先: {answer.caseDraft.destinationCountry || "-"}</p>
              <p>顧客企業: {answer.caseDraft.customerCompanyName || "-"}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {answer.relatedFeatures.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
