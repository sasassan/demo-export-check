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

export type AiImprovementStep = {
  action: string;
  scoreGain: number;
  priority: number;
  detail: string;
};

export type AiWorstCaseScenario = {
  scenario: string;
  impact: string;
  probability: "低" | "中" | "高";
  grade: "A" | "B" | "C";
};

export type AiAnalysisResult = {
  dimensions: AiDimensionResult[];
  reviewComment: string;
  keyRisk: string;
  improvementSteps: AiImprovementStep[];
  worstCaseScenarios: AiWorstCaseScenario[];
};

export function buildAnalysisPrompt(caseRecord: CaseRecord): string {
  return `あなたは輸出コンプライアンスの専門アナリストです。
以下の輸出案件を分析し、指定のJSON形式で評価してください。

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
7. catchAll（キャッチオール規制）: キャッチオール規制の該当可能性
8. reputation（風評リスク）: ブランド毀損・メディアリスク

## スコア基準
- 0〜39点 → グレードA（問題なし）
- 40〜69点 → グレードB（要確認）
- 70〜100点 → グレードC（高リスク）

## 出力形式（JSON のみ。説明文不要）
{
  "dimensions": [
    {
      "dimension": "sanctions",
      "label": "制裁リスク",
      "score": 35,
      "rationale": "評価の根拠を2〜3文で具体的に記述",
      "recommendedAction": "担当者が取るべき具体的なアクション",
      "evidence": [
        {
          "title": "エビデンスのタイトル",
          "summary": "エビデンス内容を1〜2文で説明",
          "sourceName": "参照した情報源名（例: OFAC Sanctions List）",
          "sourceType": "sanctions",
          "confidence": 0.8,
          "riskLevel": "low"
        }
      ]
    }
  ],
  "reviewComment": "このAIが最も重視した点を1〜2文で記述（例：エンドユーザーの情報が不足しており、用途確認が必要と判断した）",
  "keyRisk": "今回の案件で最も重要なリスク要因を1文で記述",
  "improvementSteps": [
    {
      "action": "用途確認書をエンドユーザーから取得する",
      "scoreGain": 12,
      "priority": 1,
      "detail": "最終用途証明書（EUC）を取得することで用途リスクが大幅に低減される"
    },
    {
      "action": "法人登記証明書で企業実在性を確認する",
      "scoreGain": 8,
      "priority": 2,
      "detail": "企業の実在確認により信用リスクが低減される"
    },
    {
      "action": "契約書に再輸出禁止条項を追加する",
      "scoreGain": 5,
      "priority": 3,
      "detail": "第三国への再輸出リスクを法的に抑制できる"
    }
  ],
  "worstCaseScenarios": [
    {
      "scenario": "商品が軍事用途に転用された場合",
      "impact": "外為法違反・輸出禁止・刑事罰の可能性",
      "probability": "低",
      "grade": "C"
    },
    {
      "scenario": "第三国経由で制裁対象国へ再輸出された場合",
      "impact": "制裁違反として取引停止・罰則対象",
      "probability": "中",
      "grade": "C"
    },
    {
      "scenario": "最終需要者が架空企業だった場合",
      "impact": "詐欺取引・企業信用の毀損リスク",
      "probability": "低",
      "grade": "C"
    }
  ]
}

必ず全8次元を評価し、各次元に1〜2件のエビデンスを含めてください。
improvementStepsは優先順位順に3〜5件、worstCaseScenarioは2〜3件含めてください。
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
