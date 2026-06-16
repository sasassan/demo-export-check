import { createId } from "@/lib/utils";
import type { EvidenceItem, InvestigationFinding, ProviderResult } from "@/lib/types";
import type { RiskDimension } from "@/lib/constants";

export function buildMockFinding(input: {
  dimension: RiskDimension;
  label: string;
  baseScore: number;
  rationale: string;
  recommendedAction: string;
  evidence: Array<{
    title: string;
    summary: string;
    sourceName: string;
    sourceType: EvidenceItem["sourceType"];
    confidence: number;
    riskLevel: EvidenceItem["riskLevel"];
    url?: string;
  }>;
}): InvestigationFinding {
  return {
    dimension: input.dimension,
    label: input.label,
    baseScore: input.baseScore,
    rationale: input.rationale,
    recommendedAction: input.recommendedAction,
    evidence: input.evidence.map((item) => ({
      id: createId("evi"),
      dimension: input.dimension,
      title: item.title,
      summary: item.summary,
      sourceName: item.sourceName,
      sourceType: item.sourceType,
      confidence: item.confidence,
      riskLevel: item.riskLevel,
      url: item.url,
      capturedAt: new Date().toISOString(),
    })),
  };
}

export function buildProviderResult(
  providerName: string,
  findings: InvestigationFinding[],
): ProviderResult {
  return {
    providerName,
    status: "success",
    findings,
    errors: [],
  };
}