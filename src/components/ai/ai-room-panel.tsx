"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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
  documentSummary?: string;
  relatedFeatures: { label: string; href: string }[];
  extractedPoints?: string[];
  relatedClauses?: string[];
  keywordHighlights?: string[];
  judgement?: string;
  recommendedChecks?: string[];
};

type ThreadEntry = {
  id: string;
  role: "user" | "assistant";
  content: string;
  answer?: Answer;
  mode: string;
  timestamp: string;
};

const EXAMPLES = [
  "この商品をベトナムへ輸出したい。何を確認すべき？",
  "EARって初心者向けにいうと何？",
  "この条文は何を意味するのか、営業担当向けに説明して",
  "相手先企業が怪しい時、最初に見るポイントは？",
  "用途確認書って何のために必要？",
  "キャッチオール規制について教えて",
];

const MODES = [
  { value: "general", label: "通常相談", description: "輸出に関する疑問をそのまま相談" },
  { value: "beginner-explain", label: "初心者向けに説明", description: "専門資料や文章をやさしく言い換え" },
  { value: "relevance-check", label: "自社輸出への関係を判断", description: "資料が自社輸出に関係あるかを整理" },
  { value: "document-read", label: "資料読解補助", description: "貼り付けた文章の要点・確認点を抽出" },
] as const;

export function AiRoomPanel() {
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("general");
  const [message, setMessage] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [thread, setThread] = useState<ThreadEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const selectedMode = MODES.find((item) => item.value === mode)!;

  const quickTemplates = useMemo(
    () => [
      { label: "初めての輸出", message: "初めて海外取引をする予定です。営業担当として最初に何を確認すべきですか？", mode: "general" as const },
      { label: "規制資料をやさしく", message: "この資料を初心者向けに説明してください。", mode: "beginner-explain" as const },
      { label: "条文の意味を確認", message: "この条文は何を意味するのか、実務でどう読むべきか説明してください。", mode: "beginner-explain" as const },
      { label: "自社に関係あるか", message: "この文章が自社輸出に関係あるか判断したいです。", mode: "relevance-check" as const },
      { label: "資料の要点整理", message: "この資料の要点と次に確認すべき点を整理してください。", mode: "document-read" as const },
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

  const submit = useCallback(async () => {
    if (!message.trim() && !sourceText.trim()) return;
    setLoading(true);
    setError(null);

    const userEntry: ThreadEntry = {
      id: `u-${Date.now()}`,
      role: "user",
      content: message || "(資料読解のみ)",
      mode,
      timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    };

    setThread((prev) => [...prev, userEntry]);

    // Build history for context
    const history = thread
      .filter((entry) => entry.role === "user" || entry.role === "assistant")
      .map((entry) => ({
        role: entry.role as "user" | "assistant",
        content: entry.role === "user" ? entry.content : (entry.answer?.simpleExplanation ?? entry.content),
      }));

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode, sourceText, sourceUrl, history }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error ?? `サーバーエラー (${response.status})`);
      }

      const data = await response.json();
      const answer = data.answer as Answer | null;

      const assistantEntry: ThreadEntry = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: answer?.simpleExplanation ?? "回答を生成できませんでした。",
        answer: answer ?? undefined,
        mode,
        timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
      };

      setThread((prev) => [...prev, assistantEntry]);
      setMessage("");

      setTimeout(() => threadEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [message, mode, sourceText, sourceUrl, thread]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  };

  const handleNewThread = () => {
    setThread([]);
    setMessage("");
    setSourceText("");
    setSourceUrl("");
    setPdfFileName("");
    setPdfStatus("idle");
    setError(null);
  };

  return (
    <div className="trade-glass-card rounded-[1.75rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">AI consultation</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">AI相談室</h2>
        </div>
        <div className="flex gap-2">
          {thread.length > 0 && (
            <button type="button" onClick={handleNewThread} className="trade-secondary-button !px-4 !py-2 !text-xs">
              新しい相談
            </button>
          )}
        </div>
      </div>

      {/* Thread view */}
      {thread.length > 0 && (
        <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          {thread.map((entry) => (
            <div key={entry.id} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                entry.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "border border-cyan-100 bg-white text-slate-900"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-semibold ${entry.role === "user" ? "text-indigo-200" : "text-indigo-500"}`}>
                    {entry.role === "user" ? "あなた" : "AI"}
                  </span>
                  <span className={`text-[10px] ${entry.role === "user" ? "text-indigo-300" : "text-slate-400"}`}>
                    {entry.timestamp}
                  </span>
                </div>
                <p className={`mt-1 text-sm leading-7 ${entry.role === "user" ? "text-white" : "text-slate-700"}`}>
                  {entry.content}
                </p>

                {entry.answer && (
                  <div className="mt-3 space-y-2">
                    {/* Document summary */}
                    {entry.answer.documentSummary && (
                      <div className="rounded-xl bg-indigo-50 p-3">
                        <p className="text-xs font-semibold text-indigo-700">資料要約</p>
                        <p className="mt-1 text-xs leading-6 text-indigo-900">{entry.answer.documentSummary}</p>
                      </div>
                    )}

                    {/* Related clauses */}
                    {entry.answer.relatedClauses && entry.answer.relatedClauses.length > 0 && (
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-800">関連条文・規程</p>
                        <ul className="mt-1 space-y-1 text-xs leading-6 text-amber-900">
                          {entry.answer.relatedClauses.map((item) => (
                            <li key={item}>・{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Keyword highlights */}
                    {entry.answer.keywordHighlights && entry.answer.keywordHighlights.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.answer.keywordHighlights.map((kw) => (
                          <Link
                            key={kw}
                            href={`/glossary?q=${encodeURIComponent(kw)}`}
                            className="rounded-full border border-cyan-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-700"
                          >
                            {kw}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Judgement + recommended checks */}
                    {(entry.answer.judgement || entry.answer.recommendedChecks?.length) && (
                      <div className="grid gap-2 md:grid-cols-2">
                        {entry.answer.judgement && (
                          <div className="rounded-xl bg-slate-100 p-3">
                            <p className="text-xs font-semibold text-slate-800">判断</p>
                            <p className="mt-1 text-xs leading-6 text-slate-700">{entry.answer.judgement}</p>
                          </div>
                        )}
                        {entry.answer.recommendedChecks && entry.answer.recommendedChecks.length > 0 && (
                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-semibold text-emerald-800">次に確認すべき点</p>
                            <ul className="mt-1 space-y-1 text-xs leading-6 text-emerald-900">
                              {entry.answer.recommendedChecks.map((item) => (
                                <li key={item}>・{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Practical details */}
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">実務ポイント</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">{entry.answer.practicalUse}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">注意点</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">{entry.answer.caution}</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">関連リスク</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">{entry.answer.relatedRisk}</p>
                      </div>
                    </div>

                    {/* Related features */}
                    <div className="flex flex-wrap gap-1">
                      {entry.answer.relatedFeatures.map((item) => (
                        <Link key={item.href + item.label} href={item.href}
                          className="rounded-lg bg-gradient-to-r from-indigo-600 to-sky-500 px-2 py-1 text-[10px] font-semibold text-white">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] animate-pulse rounded-2xl border border-cyan-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:0.3s]" />
                  <span className="ml-2 text-xs text-slate-500">回答を整理中...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button type="button" onClick={() => setError(null)} className="ml-3 font-semibold text-rose-800 hover:underline">
            閉じる
          </button>
        </div>
      )}

      {/* Mode selector */}
      <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
        <p className="text-sm font-semibold text-slate-900">相談モード</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setMode(item.value)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                mode === item.value
                  ? "border-cyan-300 bg-white shadow-sm"
                  : "border-indigo-100 bg-white/75 hover:border-indigo-200"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick templates */}
      {thread.length === 0 && (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
          <p className="text-sm font-semibold text-slate-900">テンプレートから始める</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTemplates.map((t) => (
              <button key={t.label} type="button"
                onClick={() => { setMode(t.mode); setMessage(t.message); }}
                className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-400">
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Example questions */}
      {thread.length === 0 && (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-indigo-50/70 to-cyan-50/70 p-4">
          <p className="text-sm font-semibold text-slate-900">質問例</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((item) => (
              <button key={item} type="button" onClick={() => setMessage(item)}
                className="rounded-full border border-indigo-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-indigo-400">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-slate-900">
              {thread.length > 0 ? "追加の質問" : "質問内容"}
            </label>
            <span className="text-xs text-slate-500">{message.trim().length}文字 | Ctrl+Enter で送信</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
            placeholder={thread.length > 0 ? "前の回答を踏まえて追加で質問できます" : "輸出について不安なこと、資料の意味、規制の見方などを入力してください"}
          />
        </div>

        {/* Source input (collapsible when in thread) */}
        <details className={thread.length > 0 ? "" : "open"}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-indigo-600">
            参考資料・URL（任意）
          </summary>
          <div className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">参考URL</label>
              <input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
                placeholder="https://example.com/regulation"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-slate-900">資料本文・抜粋</label>
                <span className="text-xs text-slate-500">{sourceText.trim().length}文字</span>
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
                placeholder="規制資料、法令テキスト、社内規程をここに貼り付け"
              />
              <div className="mt-3 rounded-2xl border border-dashed border-cyan-300/60 bg-cyan-50/70 p-4">
                <label className="block text-sm font-semibold text-slate-900">PDFアップロード</label>
                <p className="mt-1 text-xs leading-6 text-slate-600">PDFを選ぶと本文を抽出して資料欄へ追加します。</p>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload}
                  className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                {pdfFileName && (
                  <p className="mt-2 text-xs text-slate-600">
                    {pdfFileName} / {pdfStatus === "reading" ? "抽出中..." : pdfStatus === "done" ? "抽出完了" : pdfStatus === "error" ? "抽出失敗" : "待機中"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/80 px-4 py-3 text-xs leading-6 text-indigo-800">
          <span className="font-semibold">現在のモード:</span> {selectedMode.label} — {selectedMode.description}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs leading-6 text-slate-700">
          本機能は法的助言ではなく、法令・規程・資料を理解しやすくする一般的な読解支援です。最終判断は社内輸出管理担当者や専門家に確認してください。
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={submit} disabled={loading || (!message.trim() && !sourceText.trim())}
            className="trade-primary-button disabled:opacity-50">
            {loading ? "回答を整理中..." : thread.length > 0 ? "追加で質問する" : "AIに質問する"}
          </button>
          <button type="button" onClick={handleNewThread} className="trade-secondary-button">
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
