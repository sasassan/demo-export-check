import { formatDate } from "@/lib/utils";
import type { CaseDetail } from "@/lib/types";

export function buildReportModel(
  detail: CaseDetail,
  consultation?: {
    confidenceLabel?: "高" | "中" | "低";
    citations?: Array<{
      label: string;
      snippet: string;
      sourceType: "sourceText" | "urlFetched" | "dictionary" | "model";
    }>;
    documentSummary?: string;
    factHighlights?: string[];
    relatedClauses?: string[];
  } | null,
) {
  if (!detail.assessment) {
    return null;
  }

  return {
    generatedAt: formatDate(new Date().toISOString()),
    caseId: detail.case.id,
    productName: detail.case.productName,
    modelNumber: detail.case.modelNumber,
    destinationCountry: detail.case.destinationCountry,
    customerCompanyName: detail.case.customerCompanyName,
    overallGrade: detail.assessment.summary.overall,
    summary: detail.assessment.summary.summary,
    reportNarrative: detail.assessment.reportNarrative,
    dimensions: detail.assessment.dimensions,
    evidence: detail.assessment.evidence.slice(0, 6),
    nextActions: detail.assessment.summary.nextActions,
    headline: detail.assessment.summary.headline,
    confidenceLabel: consultation?.confidenceLabel,
    citations: consultation?.citations ?? [],
    documentSummary: consultation?.documentSummary,
    factHighlights: consultation?.factHighlights ?? [],
    relatedClauses: consultation?.relatedClauses ?? [],
    regulationUpdates: detail.assessment.regulationUpdates ?? [],
  };
}