import type { CaseRecord } from "@/lib/types";

export type AiDimensionResult = {
  dimension: string;
  label: string;
  score: number;
  rationale: string;
  recommendedAction: string;
  evidence: {
    title: string;
    summary: string;
    sourceName: string;
    sourceType: "sanctions" | "company" | "news" | "country" | "ai";
    confidence: number;
    riskLevel: "low" | "medium" | "high";
    url?: string;
  }[];
};

export type AiAnalysisResult = {
  dimensions: AiDimensionResult[];
};

export function buildAnalysisPrompt(caseRecord: CaseRecord): string {
  return `あなたは輸出コンプライアンスの専門アナリストです。
以下の輸出案件を分析し、8つのリスク次元をJSON形式で評価してください。

## 案件情報
- 商品名: ${caseRecord.productName}
- 型番: ${caseRecord.modelNumber}
- 輸出先国: ${caseRecord.destinationCountry}
- 顧客企業名: ${caseRecord.customerCompanyName}

## 評価する8つのリスク次元
1. sanctions（制裁リスク）: OFAC、EU、UN、日本外為法などの制裁リスト該当可能性
2. endUser（エンドユーザーリスク）: 企業の実在性・信用・軍事関与の可能性
3. ubo（UBOリスク）: 実質的支配者の制裁・不審取引への関与
4. peps（PEPsリスク）: 政治的影響力のある人物との関連
5. country（国リスク）: 輸出先国の政情・制裁・輸出規制の状況
6. useCase（用途リスク）: 軍民両用・軍事転用の可能性
7. catchAll（キャッチオール）: キャッチオール規制の該当可能性
8. reputation（風評リスク）: ブランド毀損・メディアリスク

## スコア基準
- 0〜39点 → グレードA（問題なし）
- 40〜69点 → グレードB（要確認）
- 70〜100点 → グレードC（高リスク）

## 出力形式（JSON のみ。説明文は不要）
{
  "dimensions": [
    {
      "dimension": "sanctions",
      "label": "制裁リスク",
      "score": 35,
      "rationale": "評価の根拠を2〜3文で具体的に記述",
      "recommendedAction": "担当者が取るべき具体的なアクションを1文で記述",
      "evidence": [
        {
          "title": "エビデンスのタイトル",
          "summary": "エビデンスの内容を1〜2文で説明",
          "sourceName": "参照した情報源名（例: OFAC Sanctions List, UN Security Council Resolutions）",
          "sourceType": "sanctions",
          "confidence": 0.8,
          "riskLevel": "low"
        }
      ]
    }
  ]
}

必ず全8次元を評価し、各次元に1〜2件のエビデンスを含めてください。
JSON以外のテキストは出力しないでください。`;
}

export function parseAiResponse(text: string): AiAnalysisResult | null {
  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    if (parsed && Array.isArray(parsed.dimensions)) {
      return parsed as AiAnalysisResult;
    }
    return null;
  } catch {
    return null;
  }
}
