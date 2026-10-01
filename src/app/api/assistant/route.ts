import { NextResponse } from "next/server";

import { askAssistant, type ConversationMessage } from "@/lib/ai/assistant";
import {
  buildCitationsFromChunks,
  classifyConfidence,
  retrieveRelevantChunks,
} from "@/lib/ai/rag";
import type { AssistantAnswer } from "@/lib/ai/types";
import type { AiModel } from "@/lib/types";
import { extractCaseDraftFromConsultation } from "@/lib/ai/extract-case-draft";
import { getSessionEmail } from "@/lib/auth/server";
import { saveAiConsultation } from "@/lib/db/repository";
import { searchDictionary, getAllTerms } from "@/lib/export-dictionary";
import { createId } from "@/lib/utils";
import {
  checkAiRateLimit,
  resolveAiRateLimitIdentity,
  toRateLimitErrorPayload,
} from "@/lib/ai/rate-limit";

/**
 * AI相談室のchatタイムアウト(既定値: OPENAI_CHAT_TIMEOUT_MS等、デフォルト30秒。
 * src/lib/ai/config.tsのTIMEOUT_DEFAULTS.chat参照)がVercelの関数実行時間上限
 * より先に切れるよう、上限を明示的に確保しておく。
 */
export const maxDuration = 45;

/* ---------- helpers ---------- */

function splitSentences(text: string) {
  return text
    .split(/(?<=[。！？.!?])\s+|\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickTopUnique(items: string[], limit: number) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const normalized = item.replace(/\s+/g, " ").trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= limit) break;
  }
  return result;
}

function extractClauseLikeSentences(text: string) {
  const sentences = splitSentences(text);
  return pickTopUnique(
    sentences.filter((s) =>
      /(条|項|号|規定|規程|法|施行令|通達|告示|ガイドライン|別表|対象|許可|禁止|義務|承認|確認)/i.test(s),
    ),
    4,
  );
}

function extractKeywordHighlights(text: string) {
  const matches = text.match(
    /([A-Z]{2,}(?:\d{1,3})?|ECCN|EAR99|EAR|PEPs|UBO|OFAC|SDN|EUC|ICP|AEO|HSコード|外為法|キャッチオール規制|再輸出禁止条項|最終需要者|用途確認書|第三国経由|軍事用途|社内規程|ガイドライン|通達|デュアルユース|該非判定|包括許可|ワッセナー|Entity List|フォワーダー)/gi,
  );
  return pickTopUnique(matches ?? [], 8);
}

function buildDocumentSummary(text: string) {
  const sentences = splitSentences(text).filter((s) => s.length >= 18);
  return pickTopUnique(sentences, 3).join(" ");
}

async function fetchUrlText(sourceUrl: string) {
  try {
    const response = await fetch(sourceUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "ExportRiskNavigator/1.0" },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) return null;
    const html = await response.text();
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
  } catch {
    return null;
  }
}

/* ---------- fallback answer builder ---------- */

function buildSmartフォールバック(input: {
  message: string;
  mode: string;
  sourceText?: string;
  fetchedUrlText?: string;
  sourceUrl?: string;
  dictionaryHit: ReturnType<typeof searchDictionary>;
}): AssistantAnswer {
  const { message, mode, sourceText, fetchedUrlText, sourceUrl, dictionaryHit } = input;
  const analysisText = [sourceText, fetchedUrlText, message].filter(Boolean).join(" ");

  const hasMilitary = /(軍事|weapon|missile|defense|dual use|兵器|デュアルユース)/i.test(analysisText);
  const hasCountryRisk = /(iran|russia|north korea|syria|中国|ロシア|イラン|北朝鮮|キューバ|ミャンマー)/i.test(analysisText);
  const hasEndUserGap = /(end user|最終需要者|用途不明|unknown use|再輸出|用途確認)/i.test(analysisText);
  const hasRegulation = /(外為法|EAR|ECCN|キャッチオール規制|輸出令|別表|規制)/i.test(analysisText);

  const clauseSentences = extractClauseLikeSentences(analysisText);
  const keywordHighlights = extractKeywordHighlights(analysisText);
  const documentSummary = buildDocumentSummary(analysisText);
  const chunks = retrieveRelevantChunks({
    message,
    sourceText,
    fetchedUrlText,
  });
  const citations = buildCitationsFromChunks(chunks);
  const confidenceLabel = classifyConfidence({
    chunks,
    hasDictionaryHit: Boolean(dictionaryHit),
    hasSourceMaterial: Boolean(sourceText || fetchedUrlText),
  });

  // Detect question intent
  const isAboutCountry = /(どの国|輸出先|国リスク|制裁対象国)/i.test(message);
  const isAboutProduct = /(製品|商品|型番|品目|該非|ECCN)/i.test(message);
  const isAboutCompany = /(企業|取引先|顧客|相手先|信用)/i.test(message);
  const isAboutProcess = /(手続き|手順|フロー|申請|許可)/i.test(message);

  // Dynamic explanation based on question
  let simpleExplanation: string;
  if (mode === "beginner-explain" && (sourceText || fetchedUrlText)) {
    simpleExplanation = clauseSentences.length > 0
      ? `この資料には規制・法令に関する記述が${clauseSentences.length}箇所見つかりました。要点としては、${clauseSentences[0].slice(0, 60)}...という内容が中心です。初心者の方は、まず自社製品がこの規制の対象になるかどうかを確認することから始めてください。`
      : "この資料は輸出管理に関連する内容を含んでいます。専門用語が多い場合は、輸出辞典で個別に確認すると理解しやすくなります。";
  } else if (mode === "relevance-check") {
    simpleExplanation = hasMilitary
      ? "この内容には軍事・デュアルユースに関連する可能性のある記述が含まれています。自社製品の用途確認を優先して行うことを推奨します。"
      : hasCountryRisk
        ? "制裁対象国または懸念国に関する記述が含まれています。輸出先国の規制状況を確認してください。"
        : "直接的な規制該当性は確認できませんでしたが、用途・需要者・輸出先国の3点で最終確認を行ってください。";
  } else if (dictionaryHit) {
    simpleExplanation = dictionaryHit.simpleExplanation;
  } else if (isAboutCountry) {
    simpleExplanation = "輸出先国のリスクを確認するには、(1)制裁対象国リスト、(2)キャッチオール規制の対象地域、(3)輸出令別表の地域区分を順に確認します。";
  } else if (isAboutProduct) {
    simpleExplanation = "製品の規制該当性を確認するには、(1)輸出令別表第一との照合（該非判定）、(2)ECCNの確認、(3)キャッチオール規制の該当性確認を行います。";
  } else if (isAboutCompany) {
    simpleExplanation = "取引先の信用確認では、(1)SDNリスト・Entity Listとの照合、(2)実質支配者(UBO)の確認、(3)過去の取引実績・信用調査を行います。";
  } else if (isAboutProcess) {
    simpleExplanation = "輸出管理の基本手順は、(1)該非判定、(2)取引審査（用途・需要者・経由地確認）、(3)許可申請（必要な場合）、(4)出荷管理、(5)記録保管です。";
  } else {
    simpleExplanation = "輸出管理では、製品・輸出先国・相手企業・用途の4点を確認することが基本です。不明点はAI相談室で具体的に質問すると、より詳しい回答が得られます。";
  }

  // Dynamic recommended checks
  const recommendedChecks: string[] = [];
  if (hasMilitary) recommendedChecks.push("軍事転用の可能性を用途確認書で確認する");
  if (hasCountryRisk) recommendedChecks.push("輸出先国の制裁状況・規制状況を最新情報で確認する");
  if (hasEndUserGap) recommendedChecks.push("最終需要者の身元確認を実施する");
  if (hasRegulation) recommendedChecks.push("該当する規制条文を特定し、許可要件を確認する");
  if (recommendedChecks.length === 0) {
    recommendedChecks.push(
      "製品の該非判定を実施する",
      "輸出先国の規制状況を確認する",
      "取引先の制裁リスト照合を行う",
    );
  }

  // Dynamic judgement
  const riskLevel = [hasMilitary, hasCountryRisk, hasEndUserGap, hasRegulation].filter(Boolean).length;
  const judgement = riskLevel >= 3
    ? "複数のリスク要因が検出されています。詳細な確認を推奨します。"
    : riskLevel >= 1
      ? "一部にリスク要因が見られます。該当箇所を重点的に確認してください。"
      : "明確なリスク要因は検出されませんでしたが、基本的な確認は必要です。";

  return {
    title: dictionaryHit?.term ?? (mode === "document-read" ? "資料読解サポート結果" : "AI相談室の回答"),
    confidenceLabel,
    caseDraft: extractCaseDraftFromConsultation({
      question: message,
      sourceText: sourceText || fetchedUrlText,
    }),
    documentSummary: documentSummary || "資料全体の要点を十分に抽出できなかったため、質問文を中心に整理しています。",
    simpleExplanation,
    practicalUse: dictionaryHit?.practicalUse ?? "この内容が自社輸出に関係するかは、製品・輸出先・相手先・用途の4点で切り分けると判断しやすくなります。",
    caution: dictionaryHit?.caution ?? "最終判断は社内の輸出管理担当・法務確認を前提にしてください。本回答は一般的な情報整理であり、法的助言ではありません。",
    relatedRisk: hasMilitary
      ? "軍事転用・デュアルユースリスクが高いため、用途確認を優先してください。"
      : hasCountryRisk
        ? "国リスクが高い地域への輸出です。制裁リスト・輸出許可要件を確認してください。"
        : "相手先信用・用途確認・契約条件の整合性が主な確認ポイントです。",
    extractedPoints: [
      sourceText ? "貼り付けられた資料本文をもとに回答しています。" : fetchedUrlText ? "URL本文を自動取得して回答しています。" : "質問内容をもとに回答しています。",
      sourceUrl ? `参考URL: ${sourceUrl}` : "参考URLは未指定です。",
      clauseSentences.length > 0 ? `条文・規程らしい記述を${clauseSentences.length}箇所抽出しました。` : "条文形式の記述は多くありません。",
      keywordHighlights.length > 0 ? `重要語句: ${keywordHighlights.slice(0, 3).join("、")}` : "特定の規制キーワードは検出されませんでした。",
    ],
    factHighlights: chunks.slice(0, 2).map((chunk) => chunk.text.slice(0, 80)),
    assumptionHighlights:
      sourceText || fetchedUrlText
        ? ["資料に記載のない背景事情や契約条件は別途確認が必要です。"]
        : ["資料本文がないため、質問文からの一般論ベースで整理しています。"],
    relatedClauses: clauseSentences.length > 0 ? clauseSentences : ["条文・規程らしい記述は少ないため、全体趣旨と実務影響を中心に整理しました。"],
    keywordHighlights: keywordHighlights.length > 0 ? keywordHighlights : ["規制分類", "輸出先国", "相手先確認", "用途確認"],
    followUpQuestions: [
      "この案件で最終需要者をどう確認しますか？",
      "用途確認書やEUCは必要ですか？",
      "輸出先国や経由地に追加リスクはありますか？",
    ],
    citations,
    judgement,
    recommendedChecks,
    relatedFeatures: [
      { label: "輸出辞典を見る", href: "/glossary" },
      { label: "学習コンテンツを見る", href: "/learning" },
      { label: "AI診断で案件を確認", href: "/cases/new" },
    ],
    referenceLinks: dictionaryHit?.referenceLinks ?? [],
  };
}

/* ---------- save helper ---------- */

async function saveConsultation(params: {
  userEmail: string;
  mode: string;
  message: string;
  sourceUrl?: string;
  sourceText?: string;
  fetchedUrlText?: string;
  sourceFetchStatus: "success" | "failed" | "not_requested";
  answer: AssistantAnswer;
}) {
  const { userEmail, mode, message, sourceUrl, sourceText, fetchedUrlText, answer } = params;
  const consultationId = createId("consult");
  await saveAiConsultation({
    id: consultationId,
    userEmail,
    mode,
    question: message,
    sourceUrl: sourceUrl || undefined,
    sourceText: sourceText || undefined,
    fetchedUrlText: fetchedUrlText || undefined,
    sourceFetchStatus: params.sourceFetchStatus,
    answerTitle: answer.title,
    answer: answer.simpleExplanation,
    confidenceLabel: answer.confidenceLabel,
    documentSummary: answer.documentSummary,
    judgement: answer.judgement,
    factHighlights: answer.factHighlights,
    assumptionHighlights: answer.assumptionHighlights,
    relatedClauses: answer.relatedClauses,
    keywordHighlights: answer.keywordHighlights,
    followUpQuestions: answer.followUpQuestions,
    citations: answer.citations,
    recommendedChecks: answer.recommendedChecks,
    caseDraft: answer.caseDraft ?? extractCaseDraftFromConsultation({ question: message, sourceText: sourceText || fetchedUrlText || undefined }),
    createdAt: new Date().toISOString(),
  });
  return consultationId;
}

/* ---------- main handler ---------- */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      message = "",
      mode = "general",
      sourceText = "",
      sourceUrl = "",
      history = [],
      aiModel,
    } = body as {
      message?: string;
      mode?: string;
      sourceText?: string;
      sourceUrl?: string;
      history?: ConversationMessage[];
      aiModel?: AiModel;
    };

    const sessionEmail = await getSessionEmail();
    const userEmail = sessionEmail ?? "anonymous";

    // AI APIコスト暴走ガード: 認証済み利用者はメールアドレス単位、匿名利用は
    // IPハッシュ単位で短時間窓/日次上限を適用する（このエンドポイントは
    // 未ログインでも利用できるため、なりすまし対策としてIP単位の識別を用いる）。
    const rateLimitIdentity = resolveAiRateLimitIdentity(request, sessionEmail);
    const rateLimitDecision = await checkAiRateLimit(rateLimitIdentity);
    if (!rateLimitDecision.allowed) {
      const payload = toRateLimitErrorPayload(rateLimitDecision);
      return NextResponse.json(payload.body, {
        status: payload.status,
        headers: { "Retry-After": String(payload.retryAfterSeconds) },
      });
    }

    // URL fetch
    let fetchedUrlText: string | null = null;
    if (sourceUrl) {
      fetchedUrlText = await fetchUrlText(sourceUrl);
    }
    const effectiveSourceText = sourceText || fetchedUrlText || "";
    const sourceFetchStatus: "success" | "failed" | "not_requested" = sourceUrl
      ? fetchedUrlText ? "success" : "failed"
      : "not_requested";
    const dictionaryHit = searchDictionary(message);
    const relevantChunks = retrieveRelevantChunks({
      message,
      sourceText,
      fetchedUrlText: fetchedUrlText ?? undefined,
    });
    const fallbackCitations = buildCitationsFromChunks(relevantChunks) ?? [];
    const confidenceLabel = classifyConfidence({
      chunks: relevantChunks,
      hasDictionaryHit: Boolean(dictionaryHit),
      hasSourceMaterial: Boolean(effectiveSourceText),
    });

    // If pure dictionary hit with no AI needed
    if (dictionaryHit && mode === "dictionary" && !sourceText && !sourceUrl) {
      const answer: AssistantAnswer = {
        answerSource: "fallback-no-key",
        answerSourceLabel: "辞典データベースからの回答",
        title: dictionaryHit.term,
        simpleExplanation: dictionaryHit.simpleExplanation,
        practicalUse: dictionaryHit.practicalUse,
        caution: dictionaryHit.caution,
        relatedRisk: dictionaryHit.relatedRisk,
        confidenceLabel: "中",
        documentSummary: `${dictionaryHit.term} に関する基本概念を短時間で理解するための辞典解説です。`,
        factHighlights: [dictionaryHit.simpleExplanation],
        assumptionHighlights: ["詳細な案件条件や契約条件は別途確認が必要です。"],
        followUpQuestions: [
          `${dictionaryHit.term.split("（")[0]} は自社製品に関係しますか？`,
          `${dictionaryHit.term.split("（")[0]} を確認するには何が必要ですか？`,
        ],
        citations: [
          {
            label: "辞典根拠",
            snippet: dictionaryHit.simpleExplanation,
            sourceType: "dictionary",
          },
        ],
        recommendedChecks: [
          "案件条件に照らしてこの用語が関係するか確認する",
          "必要ならAI相談室で具体案件として深掘りする",
        ],
        relatedFeatures: dictionaryHit.relatedFeatures,
        referenceLinks: dictionaryHit.referenceLinks ?? [],
      };

      const consultationId = await saveConsultation({
        userEmail, mode, message, sourceUrl, sourceText, fetchedUrlText: fetchedUrlText ?? undefined,
        sourceFetchStatus, answer,
      });

      return NextResponse.json({
        answer,
        sourceMeta: { urlFetchStatus: sourceFetchStatus },
        consultationId,
        allTerms: getAllTerms(),
      });
    }

    // Try AI assistant
    const aiResult = await askAssistant({
      message,
      mode,
      sourceText: sourceText || undefined,
      sourceUrl: sourceUrl || undefined,
      fetchedUrlText: fetchedUrlText ?? undefined,
      history,
      aiModel,
    });

    let finalAnswer: AssistantAnswer;

    if (aiResult.ok) {
      // AI succeeded - merge with dictionary if available
      const aiData = aiResult.data as Partial<AssistantAnswer> & Record<string, unknown>;
      finalAnswer = {
        answerSource: "live",
        answerSourceLabel: "実AI回答",
        title: (aiData.title as string) ?? dictionaryHit?.term ?? "AI相談室の回答",
        confidenceLabel: aiData.confidenceLabel ?? confidenceLabel,
        caseDraft: aiData.caseDraft ?? extractCaseDraftFromConsultation({ question: message, sourceText: effectiveSourceText || undefined }),
        documentSummary: (aiData.documentSummary as string) ?? (effectiveSourceText ? buildDocumentSummary(effectiveSourceText) : undefined),
        simpleExplanation: (aiData.simpleExplanation as string) ?? "回答の生成に問題がありました。",
        practicalUse: (aiData.practicalUse as string) ?? dictionaryHit?.practicalUse ?? "製品・輸出先・相手先・用途の4点で判断しやすくなります。",
        caution: (aiData.caution as string) ?? dictionaryHit?.caution ?? "最終判断は社内の輸出管理担当者に確認してください。",
        relatedRisk: (aiData.relatedRisk as string) ?? dictionaryHit?.relatedRisk ?? "規制該当性・相手先信用・用途不明確さが典型的な論点です。",
        extractedPoints: (aiData.extractedPoints as string[]) ?? undefined,
        factHighlights:
          (aiData.factHighlights as string[]) ??
          relevantChunks.slice(0, 2).map((chunk) => chunk.text.slice(0, 90)),
        assumptionHighlights:
          (aiData.assumptionHighlights as string[]) ??
          ["資料に記載されていない条件や契約上の制約は別途確認が必要です。"],
        relatedClauses: (aiData.relatedClauses as string[]) ?? (effectiveSourceText ? extractClauseLikeSentences(effectiveSourceText) : undefined),
        keywordHighlights: (aiData.keywordHighlights as string[]) ?? (effectiveSourceText ? extractKeywordHighlights(effectiveSourceText) : undefined),
        followUpQuestions:
          (aiData.followUpQuestions as string[]) ??
          [
            "この回答を踏まえて、次に社内で何を確認すべきですか？",
            "用途確認書や契約条件の追加確認は必要ですか？",
          ],
        citations:
          (aiData.citations as AssistantAnswer["citations"]) ??
          (fallbackCitations.length > 0
            ? fallbackCitations
            : dictionaryHit
              ? [
                  {
                    label: "辞典根拠",
                    snippet: dictionaryHit.simpleExplanation,
                    sourceType: "dictionary",
                  },
                ]
              : undefined),
        judgement: (aiData.judgement as string) ?? undefined,
        recommendedChecks: (aiData.recommendedChecks as string[]) ?? undefined,
        relatedFeatures: (aiData.relatedFeatures as AssistantAnswer["relatedFeatures"]) ?? [
          { label: "輸出辞典を見る", href: "/glossary" },
          { label: "AI診断で案件を確認", href: "/cases/new" },
        ],
        referenceLinks: (aiData.referenceLinks as AssistantAnswer["referenceLinks"]) ?? dictionaryHit?.referenceLinks ?? [],
      };
    } else {
      // AI failed or no API key - smart fallback
      if (aiResult.reason === "error") {
        console.error(
          `[assistant route] AI呼び出しが失敗したためフォールバックを使用します: ${aiResult.errorMessage}`,
        );
      }
      finalAnswer = buildSmartフォールバック({
        message, mode, sourceText, fetchedUrlText: fetchedUrlText ?? undefined,
        sourceUrl, dictionaryHit,
      });
      finalAnswer.answerSource = aiResult.reason === "error" ? "fallback-error" : "fallback-no-key";
      finalAnswer.answerSourceLabel =
        aiResult.reason === "error"
          ? "AI応答に失敗したため簡易判定を表示しています"
          : "APIキー未設定のため簡易判定を表示しています";
    }

    const consultationId = await saveConsultation({
      userEmail, mode, message, sourceUrl, sourceText, fetchedUrlText: fetchedUrlText ?? undefined,
      sourceFetchStatus, answer: finalAnswer,
    });

    return NextResponse.json({
      answer: finalAnswer,
      usedModel: aiResult.ok ? aiResult.usedModel : undefined,
      sourceMeta: {
        urlFetchStatus: sourceFetchStatus,
        fetchedExcerpt: fetchedUrlText?.slice(0, 200) ?? undefined,
      },
      consultationId,
      allTerms: getAllTerms(),
    });
  } catch (error) {
    const isJsonError = error instanceof SyntaxError;
    const msg = isJsonError
      ? "リクエストの形式が不正です"
      : error instanceof Error
        ? `処理中にエラーが発生しました: ${error.message}`
        : "不明なエラーが発生しました";
    console.error("[assistant route]", error);
    return NextResponse.json({ error: msg }, { status: isJsonError ? 400 : 500 });
  }
}
