import { formatDate } from "@/lib/utils";
import type { CaseDetail } from "@/lib/types";

export function buildReportModel(
  detail: CaseDetail,
  consultation?: {
    documentSummary?: string;
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
    documentSummary: consultation?.documentSummary,
    relatedClauses: consultation?.relatedClauses ?? [],
  };
}