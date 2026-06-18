import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { MockCountryProvider } from "@/lib/providers/mock/country";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { getProviderRuntimeInfo } from "@/lib/ai/config";

export class GeminiProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const runtime = getProviderRuntimeInfo("gemini");
    const apiKey = runtime.apiKey;
    if (runtime.status !== "live" || !apiKey) {
      const fallback = await new MockCountryProvider().run(caseRecord);
      const findings = fallback.findings.map((f) => ({
        ...f,
        aiModel: "mock" as const,
      }));
      return {
        ...buildProviderResult("google-gemini", findings),
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
        providerReason: runtime.reason,
      };
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const result = await model.generateContent(buildAnalysisPrompt(caseRecord));
      const text = result.response.text();
      const parsed = parseAiResponse(text);
      if (!parsed) throw new Error("Gemini: JSON parse failed");

      const findings: InvestigationFinding[] = parsed.dimensions
        .filter((d) => RISK_DIMENSIONS.includes(d.dimension as RiskDimension))
        .map((d) => ({
          dimension: d.dimension as RiskDimension,
          label: d.label,
          baseScore: Math.min(100, Math.max(0, d.score)),
          rationale: d.rationale,
          recommendedAction: d.recommendedAction,
          aiModel: "gemini" as const,
          evidence: d.evidence.map((e) => ({
            id: createId("evi"),
            dimension: d.dimension as RiskDimension,
            title: e.title,
            summary: e.summary,
            sourceName: e.sourceName,
            sourceType: e.sourceType,
            confidence: e.confidence,
            riskLevel: e.riskLevel,
            url: e.url,
            capturedAt: new Date().toISOString(),
            aiModel: "gemini" as const,
          })) as EvidenceItem[],
        }));

      return {
        ...buildProviderResult("google-gemini", findings),
        reviewComment: parsed.reviewComment,
        keyRisk: parsed.keyRisk,
        rawImprovementSteps: parsed.improvementSteps,
        rawWorstCaseScenarios: parsed.worstCaseScenarios,
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
      };
    } catch (error) {
      console.error("Gemini provider error:", error);
      const fallback = await new MockCountryProvider().run(caseRecord);
      return {
        ...buildProviderResult("google-gemini", fallback.findings),
        status: "partial" as const,
        errors: [error instanceof Error ? error.message : "Gemini error"],
        providerStatus: "fallback-error" as const,
        providerStatusLabel: "フォールバック",
        providerReason: error instanceof Error ? error.message : "Gemini error",
      };
    }
  }
}
