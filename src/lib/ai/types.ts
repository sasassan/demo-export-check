export type AssistantAnswer = {
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
  judgement?: string;
  recommendedChecks?: string[];
  relatedFeatures: { label: string; href: string }[];
  referenceLinks?: { label: string; href: string }[];
  sourceMeta?: {
    urlFetchStatus?: "success" | "failed" | "not_requested";
    fetchedExcerpt?: string;
  };
};
