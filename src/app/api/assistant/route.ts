import { NextResponse } from "next/server";

import { generateAssistantAnswer } from "@/lib/ai/assistant";
import { extractCaseDraftFromConsultation } from "@/lib/ai/extract-case-draft";
import { getSessionEmail } from "@/lib/auth/server";
import { saveAiConsultation } from "@/lib/db/repository";
import { searchDictionary } from "@/lib/export-dictionary";
import { createId } from "@/lib/utils";

function stripHtmlTags(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchUrlText(sourceUrl: string) {
  try {
    const url = new URL(sourceUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "ExportRiskNaviBot/1.0",
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const rawText = await response.text();

    if (contentType.includes("text/html")) {
      return stripHtmlTags(rawText).slice(0, 6000);
    }

    if (contentType.includes("text/plain") || contentType.includes("application/json")) {
      return rawText.slice(0, 6000);
    }

    return null;
  } catch {
    return null;
  }
}

function buildDocumentSupportAnswer(input: {
  message: string;
  sourceText: string;
  sourceUrl: string;
  mode: string;
  fetchedUrlText?: string;
}) {
  const analysisText = [input.sourceText, input.fetchedUrlText, input.message]
    .filter(Boolean)
    .join(" ");
  const excerpt = (input.sourceText || input.fetchedUrlText || "").slice(0, 500);
  const hasMilitary = /(軍事|weapon|missile|defense|dual use|兵器)/i.test(analysisText);
  const hasCountryRisk = /(iran|russia|north korea|syria|中国|ロシア|イラン|北朝鮮)/i.test(analysisText);
  const hasEndUserGap = /(end user|最終需要者|用途不明|unknown use|再輸出)/i.test(analysisText);

  const extractedPoints = [
    excerpt ? `資料の中心テーマ: ${excerpt.slice(0, 80)}...` : "資料本文の具体的な抜粋は未入力です。",
    input.sourceUrl ? `参考URLが指定されています: ${input.sourceUrl}` : "参考URLは未指定です。",
    input.fetchedUrlText ? "URL本文を自動取得して要点整理に反映しました。" : "URL本文の自動取得は行っていません。",
    hasMilitary ? "軍事転用・デュアルユース関連の語句が含まれています。" : "軍事転用を直接示す語句は強く見えていません。",
  ];

  const recommendedChecks = [
    "対象製品がどの規制分類に関係するか確認する",
    "輸出先国と最終需要者の確認資料をそろえる",
    hasEndUserGap ? "用途確認書・最終需要者情報を追加取得する" : "用途説明と契約条件の整合性を確認する",
  ];

  let judgement = "自社輸出との関係は一定程度あります。製品・輸出先国・相手先・用途の4点で当てはまるかを確認してください。";
  if (input.mode === "beginner-explain") {
    judgement = "この資料は、まず『何が規制対象になり得るか』を理解するための基礎説明として読むと分かりやすいです。";
  } else if (input.mode === "relevance-check") {
    judgement = hasMilitary || hasCountryRisk || hasEndUserGap
      ? "自社輸出への関係が高い可能性があります。特に用途・輸出先・相手先確認に直接つながる内容です。"
      : "直接の規制判断資料というより、事前理解や背景知識として読む位置づけに近いです。";
  } else if (input.mode === "document-read") {
    judgement = "この資料の要点を実務に置き換えると、どの案件で追加確認が必要かを見極める補助資料として使えます。";
  }

  return {
    title: "資料読解サポート結果",
    caseDraft: extractCaseDraftFromConsultation({
      question: input.message,
      sourceText: input.sourceText || input.fetchedUrlText,
    }),
    simpleExplanation:
      input.mode === "beginner-explain"
        ? "この文章を初心者向けに言い換えると、『何が規制対象になりやすく、どんな場合に追加確認が必要かを説明している資料』です。"
        : "この資料は、輸出判断に必要な論点を整理するための補助情報として読むのが適しています。",
    practicalUse:
      "実務では、製品仕様・輸出先国・相手先企業・用途説明と照らし合わせながら、どの確認資料が不足しているかを整理すると使いやすいです。",
    caution:
      "資料の一般論だけで輸出可否は決めず、実際の案件情報と照合してください。特に用途・相手先・第三国経由の有無は別途確認が必要です。",
    relatedRisk:
      hasMilitary || hasCountryRisk
        ? "用途リスク・国リスク・キャッチオール規制の観点が重要です。"
        : "相手先信用・用途確認・契約条件の整合性が主な確認ポイントです。",
    extractedPoints,
    judgement,
    recommendedChecks,
    relatedFeatures: [
      { label: "輸出辞典を見る", href: "/glossary" },
      { label: "学習コンテンツを見る", href: "/learning" },
      { label: "デモ画面を見る", href: "/demo" },
    ],
    referenceLinks: input.sourceUrl
      ? [{ label: "入力した参考URL", href: input.sourceUrl }]
      : [],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body?.message ?? "").trim();
    const mode = String(body?.mode ?? "general");
    const sourceText = String(body?.sourceText ?? "").trim();
    const sourceUrl = String(body?.sourceUrl ?? "").trim();
    const fetchedUrlText = sourceUrl ? await fetchUrlText(sourceUrl) : null;
    const effectiveSourceText = sourceText || fetchedUrlText || "";

    if (!message && !effectiveSourceText) {
      return NextResponse.json({ error: "message or sourceText is required" }, { status: 400 });
    }

    const lookupTarget = message || effectiveSourceText;
    const dictionaryHit = searchDictionary(lookupTarget);

    if (mode === "dictionary" && dictionaryHit) {
      return NextResponse.json({
        answer: {
          title: dictionaryHit.term,
          simpleExplanation: dictionaryHit.simpleExplanation,
          practicalUse: dictionaryHit.practicalUse,
          caution: dictionaryHit.caution,
          relatedRisk: dictionaryHit.relatedRisk,
          relatedFeatures: dictionaryHit.relatedFeatures,
          referenceLinks: dictionaryHit.referenceLinks ?? [],
        },
      });
    }

    const aiAnswer = await generateAssistantAnswer({
      message,
      mode,
      sourceText: effectiveSourceText || undefined,
      sourceUrl: sourceUrl || undefined,
    });

    if (aiAnswer) {
      const userEmail = await getSessionEmail();
      if (userEmail) {
        await saveAiConsultation({
          id: createId("consult"),
          userEmail,
          mode,
          question: message,
          sourceUrl: sourceUrl || undefined,
          sourceText: sourceText || undefined,
          fetchedUrlText: fetchedUrlText || undefined,
          sourceFetchStatus: sourceUrl ? (fetchedUrlText ? "success" : "failed") : "not_requested",
          answerTitle: aiAnswer.title,
          answer: aiAnswer.simpleExplanation,
          judgement: aiAnswer.judgement,
          recommendedChecks: aiAnswer.recommendedChecks,
          caseDraft: aiAnswer.caseDraft ?? extractCaseDraftFromConsultation({ question: message, sourceText: effectiveSourceText || undefined }),
          createdAt: new Date().toISOString(),
        });
      }
      return NextResponse.json({ answer: aiAnswer });
    }

    if (["beginner-explain", "relevance-check", "document-read"].includes(mode)) {
      const fallbackAnswer = buildDocumentSupportAnswer({
        message,
        sourceText: effectiveSourceText,
        sourceUrl,
        mode,
        fetchedUrlText: fetchedUrlText ?? undefined,
      });
      const userEmail = await getSessionEmail();
      if (userEmail) {
        await saveAiConsultation({
          id: createId("consult"),
          userEmail,
          mode,
          question: message,
          sourceUrl: sourceUrl || undefined,
          sourceText: sourceText || undefined,
          fetchedUrlText: fetchedUrlText || undefined,
          sourceFetchStatus: sourceUrl ? (fetchedUrlText ? "success" : "failed") : "not_requested",
          answerTitle: fallbackAnswer.title,
          answer: fallbackAnswer.simpleExplanation,
          judgement: fallbackAnswer.judgement,
          recommendedChecks: fallbackAnswer.recommendedChecks,
          caseDraft: extractCaseDraftFromConsultation({ question: message, sourceText: effectiveSourceText || undefined }),
          createdAt: new Date().toISOString(),
        });
      }
      return NextResponse.json({ answer: fallbackAnswer });
    }

    const canned = [
      "この内容は初心者向けに言い換えると、『まず何を確認すべきかを分けて考える』のがポイントです。",
      "自社輸出への関係を判断するには、①製品 ②輸出先国 ③相手企業 ④用途 の4点を確認してください。",
      "不安な場合は、公開情報だけで判断せず、用途・相手先・規制のどこに論点があるか整理するのがおすすめです。",
    ];

    const answer = dictionaryHit
      ? `${dictionaryHit.term} は「${dictionaryHit.simpleExplanation}」です。実務では「${dictionaryHit.practicalUse}」。注意点は「${dictionaryHit.caution}」です。`
      : canned.join(" ");

    const finalAnswer = {
        title: dictionaryHit?.term ?? "AI相談室の回答",
        caseDraft: extractCaseDraftFromConsultation({ question: message, sourceText: effectiveSourceText || undefined }),
        simpleExplanation: answer,
        practicalUse:
          dictionaryHit?.practicalUse ?? "この文章が自社輸出に関係するかは、製品・輸出先・相手先・用途の4点で切り分けると判断しやすくなります。",
        caution:
          dictionaryHit?.caution ?? "最終判断は社内の輸出管理担当・法務確認を前提にしてください。",
        relatedRisk:
          dictionaryHit?.relatedRisk ?? "規制該当性・相手先信用・用途不明確さが典型的な論点です。",
        extractedPoints: effectiveSourceText
          ? [
              sourceText
                ? "貼り付けられた資料本文をもとに回答しています。"
                : "URL本文を自動取得して回答しています。",
              sourceUrl ? `参考URL: ${sourceUrl}` : "参考URLは未指定です。",
            ]
          : undefined,
        judgement: effectiveSourceText
          ? "資料本文があるため、案件への関係性をより具体的に整理できます。"
          : undefined,
        recommendedChecks: effectiveSourceText
          ? ["製品・輸出先国・相手先・用途の4点で照合する", "必要なら用途確認書を取得する"]
          : undefined,
        relatedFeatures:
          dictionaryHit?.relatedFeatures ?? [
            { label: "デモ画面を見る", href: "/demo" },
            { label: "輸出辞典を見る", href: "/glossary" },
          ],
        referenceLinks: dictionaryHit?.referenceLinks ?? [],
      };

    const userEmail = await getSessionEmail();
    if (userEmail) {
      await saveAiConsultation({
        id: createId("consult"),
        userEmail,
        mode,
        question: message,
        sourceUrl: sourceUrl || undefined,
        sourceText: sourceText || undefined,
        fetchedUrlText: fetchedUrlText || undefined,
        sourceFetchStatus: sourceUrl ? (fetchedUrlText ? "success" : "failed") : "not_requested",
        answerTitle: finalAnswer.title,
        answer: finalAnswer.simpleExplanation,
        judgement: finalAnswer.judgement,
        recommendedChecks: finalAnswer.recommendedChecks,
        caseDraft: extractCaseDraftFromConsultation({ question: message, sourceText: effectiveSourceText || undefined }),
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ answer: finalAnswer });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
