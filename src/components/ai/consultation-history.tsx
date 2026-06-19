"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { buildCaseDraftLink } from "@/lib/ai/extract-case-draft";
import type { AiConsultationRecord } from "@/lib/types";

export function ConsultationHistory() {
  const router = useRouter();
  const [items, setItems] = useState<AiConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState("all");
  const [caseFilter, setCaseFilter] = useState("all");
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [feedbackSendingId, setFeedbackSendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/assistant/history")
      .then((response) => response.json())
      .then((data) => setItems(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = !query || `${item.question} ${item.answer} ${item.answerTitle}`.toLowerCase().includes(query.toLowerCase());
      const matchesMode = modeFilter === "all" || item.mode === modeFilter;
      const matchesCase = caseFilter === "all"
        || (caseFilter === "cased" && Boolean(item.caseId))
        || (caseFilter === "uncased" && !item.caseId);
      return matchesQuery && matchesMode && matchesCase;
    });
  }, [items, query, modeFilter, caseFilter]);

  async function createCaseFromConsultation(item: AiConsultationRecord) {
    setCreatingId(item.id);
    const response = await fetch(`/api/consultations/${item.id}/case`, { method: "POST" });
    const data = await response.json();
    setCreatingId(null);

    if (response.ok && data.id) {
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, caseId: data.id } : entry));
      router.push(`/cases/${data.id}`);
      router.refresh();
      return;
    }

    router.push(buildCaseDraftLink(item));
  }

  async function sendFeedback(id: string, feedback: "helpful" | "needs-work") {
    setFeedbackSendingId(id);
    const response = await fetch("/api/assistant/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consultationId: id, feedback }),
    });
    if (response.ok) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === id ? { ...entry, feedback } : entry,
        ),
      );
    }
    setFeedbackSendingId(null);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <p className="trade-section-label">Consultation History</p>
      <h2 className="mt-3 text-xl font-bold text-slate-900">相談履歴</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        これまでAI相談室で確認した内容を一覧で振り返れます。
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="キーワード検索"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900"
        />
        <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900">
          <option value="all">すべてのモード</option>
          <option value="general">通常相談</option>
          <option value="beginner-explain">初心者向けに説明</option>
          <option value="relevance-check">自社輸出への関係を判断</option>
          <option value="document-read">資料読解補助</option>
        </select>
        <select value={caseFilter} onChange={(event) => setCaseFilter(event.target.value)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900">
          <option value="all">案件化状態: すべて</option>
          <option value="uncased">未案件化</option>
          <option value="cased">案件化済み</option>
        </select>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-xs leading-6 text-cyan-900">相談内容は検索・モード・案件化状態で絞り込みできます。案件化済みの履歴はそのまま案件詳細へ戻れます。</div>

        {loading ? (
          <div className="trade-soft-block p-4 text-sm text-slate-500">読み込み中...</div>
        ) : filteredItems.length === 0 ? (
          <div className="trade-soft-block p-4 text-sm text-slate-500">該当する相談履歴はありません。</div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="trade-soft-block p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.answerTitle}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("ja-JP")}</span>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${item.caseId ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.caseId ? "案件化済み" : "未案件化"}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-[#1e3a5f]">質問: {item.question || "（資料読解のみ）"}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>

              {(item.sourceUrl || item.fetchedUrlText || item.sourceFetchStatus) && (
                <div className="mt-3 rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-3 text-xs leading-6 text-slate-700">
                  <p className="font-semibold text-cyan-900">参照根拠</p>
                  {item.sourceUrl ? <p>URL: {item.sourceUrl}</p> : null}
                  <p>
                    URL取得状態: {item.sourceFetchStatus === "success" ? "取得成功" : item.sourceFetchStatus === "failed" ? "取得失敗" : "未指定"}
                  </p>
                  {item.fetchedUrlText ? <p>取得本文冒頭: {item.fetchedUrlText.slice(0, 140)}...</p> : null}
                </div>
              )}

              {item.judgement ? (
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  <span className="font-semibold">判断:</span> {item.judgement}
                </p>
              ) : null}
              {item.confidenceLabel ? (
                <p className="mt-2 text-xs font-semibold text-[#1e3a5f]">
                  回答信頼度: {item.confidenceLabel}
                </p>
              ) : null}
              {item.factHighlights?.length ? (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs leading-6 text-emerald-900">
                  <p className="font-semibold">確認できた事実</p>
                  {item.factHighlights.map((fact) => (
                    <p key={fact}>・{fact}</p>
                  ))}
                </div>
              ) : null}
              {item.citations?.length ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs leading-6 text-slate-700">
                  <p className="font-semibold text-slate-900">根拠引用</p>
                  {item.citations.map((citation) => (
                    <p key={`${citation.label}-${citation.snippet}`}>
                      ・{citation.label}: {citation.snippet}
                    </p>
                  ))}
                </div>
              ) : null}
              {item.recommendedChecks?.length ? (
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {item.recommendedChecks.map((check) => (
                    <li key={check}>・{check}</li>
                  ))}
                </ul>
              ) : null}
              {item.caseDraft ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-blue-50 px-3 py-2 text-xs text-slate-700">
                  案件化候補: {item.caseDraft.productName || "要確認商品"}
                  {item.caseDraft.destinationCountry ? ` / ${item.caseDraft.destinationCountry}` : ""}
                  {item.caseDraft.customerCompanyName ? ` / ${item.caseDraft.customerCompanyName}` : ""}
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {item.caseId ? (
                  <Link
                    href={`/cases/${item.caseId}`}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                  >
                    案件を見る
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => createCaseFromConsultation(item)}
                    disabled={creatingId === item.id}
                    className="rounded-lg bg-gradient-to-r from-[#1e3a5f] to-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                  >
                    {creatingId === item.id ? "案件化中..." : "この相談から案件を作成"}
                  </button>
                )}
                <Link
                  href={buildCaseDraftLink(item)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  下書きを確認
                </Link>
                <button
                  type="button"
                  onClick={() => sendFeedback(item.id, "helpful")}
                  disabled={feedbackSendingId === item.id}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    item.feedback === "helpful"
                      ? "bg-emerald-600 text-white"
                      : "border border-emerald-200 bg-white text-emerald-700"
                  }`}
                >
                  役に立った
                </button>
                <button
                  type="button"
                  onClick={() => sendFeedback(item.id, "needs-work")}
                  disabled={feedbackSendingId === item.id}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    item.feedback === "needs-work"
                      ? "bg-amber-500 text-white"
                      : "border border-amber-200 bg-white text-amber-700"
                  }`}
                >
                  改善要望
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
