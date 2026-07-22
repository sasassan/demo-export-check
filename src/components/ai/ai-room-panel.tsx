"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";

type Answer = {
  confidenceLabel?: "高" | "中" | "低";
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
  factHighlights?: string[];
  assumptionHighlights?: string[];
  relatedClauses?: string[];
  keywordHighlights?: string[];
  followUpQuestions?: string[];
  citations?: Array<{
    label: string;
    snippet: string;
    sourceType: "sourceText" | "urlFetched" | "dictionary" | "model";
  }>;
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
  consultationId?: string;
};

type AiRoomPanelProps = {
  initialMode?: (typeof MODES)[number]["value"];
  initialMessage?: string;
  initialSourceText?: string;
  caseContext?: {
    caseId: string;
    productName: string;
    destinationCountry: string;
    customerCompanyName: string;
  };
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

export function AiRoomPanel({
  initialMode = "general",
  initialMessage = "",
  initialSourceText = "",
  caseContext,
}: AiRoomPanelProps) {
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>(initialMode);
  const [message, setMessage] = useState(initialMessage);
  const [sourceText, setSourceText] = useState(initialSourceText);
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "reading" | "done" | "error">("idle");
  const [thread, setThread] = useState<ThreadEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, "helpful" | "needs-work">>({});
  const threadEndRef = useRef<HTMLDivElement>(null);

  const selectedMode = MODES.find((item) => item.value === mode)!;

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
        label: "条文の意味を確認",
        message: "この条文は何を意味するのか、実務でどう読むべきか説明してください。",
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

  const sendFeedback = useCallback(
    async (consultationId: string, feedback: "helpful" | "needs-work") => {
      setFeedbackState((current) => ({ ...current, [consultationId]: feedback }));
      try {
        const response = await fetch("/api/assistant/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consultationId, feedback }),
        });
        if (!response.ok) {
          throw new Error("feedback failed");
        }
      } catch {
        setFeedbackState((current) => {
          const next = { ...current };
          delete next[consultationId];
          return next;
        });
      }
    },
    [],
  );

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

    const history = thread
      .filter((entry) => entry.role === "user" || entry.role === "assistant")
      .map((entry) => ({
        role: entry.role as "user" | "assistant",
        content:
          entry.role === "user"
            ? entry.content
            : (entry.answer?.simpleExplanation ?? entry.content),
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
      const consultationId =
        typeof data.consultationId === "string" ? data.consultationId : undefined;

      const assistantEntry: ThreadEntry = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: answer?.simpleExplanation ?? "回答を生成できませんでした。",
        answer: answer ?? undefined,
        mode,
        timestamp: new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        consultationId,
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
    setMessage(initialMessage);
    setSourceText(initialSourceText);
    setSourceUrl("");
    setPdfFileName("");
    setPdfStatus("idle");
    setError(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1e3a5f]">
            AI相談室
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">AI相談室</h2>
        </div>
        <div className="flex gap-2">
          {thread.length > 0 && (
            <button
              type="button"
              onClick={handleNewThread}
              className="trade-secondary-button !px-4 !py-2 !text-xs"
            >
              新しい相談
            </button>
          )}
        </div>
      </div>

      {thread.length > 0 && (
        <div className="mt-4 max-h-[600px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          {thread.map((entry) => (
            <div
              key={entry.id}
              className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 ${
                  entry.role === "user"
                    ? "bg-[#1e3a5f] !text-white"
                    : "border border-cyan-100 bg-white text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      entry.role === "user" ? "text-blue-200" : "text-[#1e3a5f]"
                    }`}
                  >
                    {entry.role === "user" ? "あなた" : "AI"}
                  </span>
                  <span
                    className={`text-[10px] ${
                      entry.role === "user" ? "text-blue-200" : "text-slate-500"
                    }`}
                  >
                    {entry.timestamp}
                  </span>
                </div>
                <p
                  className={`mt-1 text-sm leading-7 ${
                    entry.role === "user" ? "text-white" : "text-slate-700"
                  }`}
                >
                  {entry.content}
                </p>

                {entry.answer && (
                  <div className="mt-3 space-y-2">
                    {entry.answer.documentSummary && (
                      <div className="rounded-xl bg-blue-50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-[#1e3a5f]">資料要約</p>
                          {entry.answer.confidenceLabel ? (
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1e3a5f]">
                              信頼度 {entry.answer.confidenceLabel}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs leading-6 text-slate-800">
                          {entry.answer.documentSummary}
                        </p>
                      </div>
                    )}

                    {entry.answer.relatedClauses?.length ? (
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-800">関連条文・規程</p>
                        <ul className="mt-1 space-y-1 text-xs leading-6 text-amber-900">
                          {entry.answer.relatedClauses.map((item) => (
                            <li key={item}>・{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.answer.keywordHighlights?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {entry.answer.keywordHighlights.map((kw) => (
                          <Link
                            key={kw}
                            href={`/glossary?q=${encodeURIComponent(kw)}`}
                            className="rounded-full border border-cyan-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:border-slate-300 hover:text-[#1e3a5f]"
                          >
                            {kw}
                          </Link>
                        ))}
                      </div>
                    ) : null}

                    {(entry.answer.judgement || entry.answer.recommendedChecks?.length) && (
                      <div className="grid gap-2 md:grid-cols-2">
                        {entry.answer.judgement ? (
                          <div className="rounded-xl bg-slate-100 p-3">
                            <p className="text-xs font-semibold text-slate-800">判断</p>
                            <p className="mt-1 text-xs leading-6 text-slate-700">
                              {entry.answer.judgement}
                            </p>
                          </div>
                        ) : null}
                        {entry.answer.recommendedChecks?.length ? (
                          <div className="rounded-xl bg-emerald-50 p-3">
                            <p className="text-xs font-semibold text-emerald-800">
                              次に確認すべき点
                            </p>
                            <ul className="mt-1 space-y-1 text-xs leading-6 text-emerald-900">
                              {entry.answer.recommendedChecks.map((item) => (
                                <li key={item}>・{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {entry.answer.factHighlights?.length ? (
                      <div className="rounded-xl bg-emerald-50 p-3">
                        <p className="text-xs font-semibold text-emerald-800">確認できた事実</p>
                        <ul className="mt-1 space-y-1 text-xs leading-6 text-emerald-900">
                          {entry.answer.factHighlights.map((item) => (
                            <li key={item}>・{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.answer.assumptionHighlights?.length ? (
                      <div className="rounded-xl bg-rose-50 p-3">
                        <p className="text-xs font-semibold text-rose-800">要確認・仮定</p>
                        <ul className="mt-1 space-y-1 text-xs leading-6 text-rose-900">
                          {entry.answer.assumptionHighlights.map((item) => (
                            <li key={item}>・{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {entry.answer.citations?.length ? (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">根拠引用</p>
                        <div className="mt-2 space-y-2">
                          {entry.answer.citations.map((item) => (
                            <div
                              key={`${item.label}-${item.snippet}`}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                              <p className="text-[10px] font-semibold text-slate-500">
                                {item.label} / {item.sourceType}
                              </p>
                              <p className="mt-1 text-xs leading-6 text-slate-700">
                                {item.snippet}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">実務ポイント</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">
                          {entry.answer.practicalUse}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">注意点</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">
                          {entry.answer.caution}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-800">関連リスク</p>
                        <p className="mt-1 text-xs leading-6 text-slate-600">
                          {entry.answer.relatedRisk}
                        </p>
                      </div>
                    </div>

                    {entry.answer.followUpQuestions?.length ? (
                      <div className="rounded-xl bg-cyan-50 p-3">
                        <p className="text-xs font-semibold text-cyan-800">
                          次に深掘りしやすい質問
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {entry.answer.followUpQuestions.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setMessage(item)}
                              className="rounded-full border border-cyan-200 bg-white px-3 py-1 text-[10px] font-semibold text-cyan-800 hover:border-cyan-400"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-1">
                      {entry.answer.relatedFeatures.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          className="rounded-lg bg-gradient-to-r from-[#1e3a5f] to-sky-500 px-2 py-1 text-[10px] font-semibold text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                      {caseContext ? (
                        <Link
                          href={`/cases/${caseContext.caseId}`}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700"
                        >
                          案件詳細へ戻る
                        </Link>
                      ) : null}
                    </div>

                    {entry.consultationId ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-500">
                          この回答は役に立ちましたか？
                        </span>
                        <button
                          type="button"
                          onClick={() => sendFeedback(entry.consultationId!, "helpful")}
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                            feedbackState[entry.consultationId] === "helpful"
                              ? "bg-emerald-700 text-white"
                              : "border border-emerald-200 bg-white text-emerald-700"
                          }`}
                        >
                          役に立った
                        </button>
                        <button
                          type="button"
                          onClick={() => sendFeedback(entry.consultationId!, "needs-work")}
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
                            feedbackState[entry.consultationId] === "needs-work"
                              ? "bg-amber-700 text-white"
                              : "border border-amber-200 bg-white text-amber-700"
                          }`}
                        >
                          改善してほしい
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] animate-pulse rounded-2xl border border-cyan-100 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#1e3a5f]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#1e3a5f] [animation-delay:0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#1e3a5f] [animation-delay:0.3s]" />
                  <span className="ml-2 text-xs text-slate-500">回答を整理中...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-3 font-semibold text-rose-800 hover:underline"
          >
            閉じる
          </button>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/70 p-4">
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
                  : "border-slate-200 bg-white/75 hover:border-slate-200"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      {thread.length === 0 && (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/70 p-4">
          <p className="text-sm font-semibold text-slate-900">テンプレートから始める</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTemplates.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  setMode(t.mode);
                  setMessage(t.message);
                }}
                className="rounded-full border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-cyan-400"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {thread.length === 0 && (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-blue-50/70 to-cyan-50/70 p-4">
          <p className="text-sm font-semibold text-slate-900">質問例</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMessage(item)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-slate-900">
              {thread.length > 0 ? "追加の質問" : "質問内容"}
            </label>
            <span className="text-xs text-slate-500">
              {message.trim().length}文字 | Ctrl+Enter で送信
            </span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1e3a5f]"
            placeholder={
              thread.length > 0
                ? "前の回答を踏まえて追加で質問できます"
                : "輸出について不安なこと、資料の意味、規制の見方などを入力してください"
            }
          />
        </div>

        <details className={thread.length > 0 ? "" : "open"}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700 hover:text-[#1e3a5f]">
            参考資料・URL（任意）
          </summary>
          <div className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">参考URL</label>
              <input
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1e3a5f]"
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
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#1e3a5f]"
                placeholder="規制資料、法令テキスト、社内規程をここに貼り付け"
              />
              <div className="mt-3 rounded-2xl border border-dashed border-cyan-300/60 bg-cyan-50/70 p-4">
                <label className="block text-sm font-semibold text-slate-900">PDFアップロード</label>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  PDFを選ぶと本文を抽出して資料欄へ追加します。
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="mt-3 block w-full text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-[#1e3a5f] file:px-4 file:py-2 file:text-sm file:font-semibold file:!text-white"
                />
                {pdfFileName && (
                  <p className="mt-2 text-xs text-slate-600">
                    {pdfFileName} /{" "}
                    {pdfStatus === "reading"
                      ? "抽出中..."
                      : pdfStatus === "done"
                        ? "抽出完了"
                        : pdfStatus === "error"
                          ? "抽出失敗"
                          : "待機中"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-2xl border border-slate-200 bg-blue-50/80 px-4 py-3 text-xs leading-6 text-slate-700">
          <span className="font-semibold">現在のモード:</span> {selectedMode.label} —{" "}
          {selectedMode.description}
        </div>

        {caseContext ? (
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs leading-6 text-cyan-900">
            <span className="font-semibold">案件コンテキスト:</span>{" "}
            {caseContext.productName} / {caseContext.destinationCountry} /{" "}
            {caseContext.customerCompanyName}
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs leading-6 text-slate-700">
          本機能は法的助言ではなく、法令・規程・資料を理解しやすくする一般的な読解支援です。最終判断は社内輸出管理担当者や専門家に確認してください。
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={loading || (!message.trim() && !sourceText.trim())}
            className="trade-primary-button disabled:opacity-50"
          >
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