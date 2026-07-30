export type AssistantAnswer = {
  /** 回答が実際のAI呼び出しによるものか、簡易フォールバックかを示す */
  answerSource?: "live" | "fallback-no-key" | "fallback-error";
  answerSourceLabel?: string;
  confidenceLabel?: "高" | "中" | "低";
  caseDraft?: {
    productName?: string;
    modelNumber?: string;
    destinationCountry?: string;
    customerCompanyName?: string;
  };
  title: string;
  simpleExplanation: string;
  practicalUse: string;
  caution: string;
  relatedRisk: string;
  extractedPoints?: string[];
  relatedClauses?: string[];
  keywordHighlights?: string[];
  documentSummary?: string;
  judgement?: string;
  factHighlights?: string[];
  assumptionHighlights?: string[];
  followUpQuestions?: string[];
  citations?: Array<{
    label: string;
    snippet: string;
    sourceType: "sourceText" | "urlFetched" | "dictionary" | "model";
  }>;
  recommendedChecks?: string[];
  relatedFeatures: { label: string; href: string }[];
  referenceLinks?: { label: string; href: string }[];
  sourceMeta?: {
    urlFetchStatus?: "success" | "failed" | "not_requested";
    fetchedExcerpt?: string;
  };
};
