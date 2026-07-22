import OpenAI from "openai";
import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { MockSanctionsProvider } from "@/lib/providers/mock/sanctions";
import { MockCompanyProvider } from "@/lib/providers/mock/company";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { getProviderRuntimeInfo } from "@/lib/ai/config";

export class OpenAIProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const runtime = getProviderRuntimeInfo("gpt-4o");
    const apiKey = runtime.apiKey;
    if (runtime.status !== "live" || !apiKey) {
      const fallback = await Promise.all([
        new MockSanctionsProvider().run(caseRecord),
        new MockCompanyProvider().run(caseRecord),
      ]);
      const findings = fallback.flatMap((r) =>
        r.findings.map((f) => ({ ...f, aiModel: "mock" as const })),
      );
      return {
        ...buildProviderResult("openai-gpt4o", findings),
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
        providerReason: runtime.reason,
      };
    }

    try {
      const client = new OpenAI({ apiKey, timeout: runtime.timeoutMs });
      const response = await client.chat.completions.create({
        model: runtime.modelName,
        messages: [
          {
            role: "system",
            content:
              "あなたは輸出コンプライアンスの専門アナリストです。JSON形式のみで回答してください。",
          },
          {
            role: "user",
            content: buildAnalysisPrompt(caseRecord),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const text = response.choices[0]?.message?.content ?? "";
      const parsed = parseAiResponse(text);
      if (!parsed) throw new Error("GPT-4o: JSON parse failed");

      const findings: InvestigationFinding[] = parsed.dimensions
        .filter((d) => RISK_DIMENSIONS.includes(d.dimension as RiskDimension))
        .map((d) => ({
          dimension: d.dimension as RiskDimension,
          label: d.label,
          baseScore: Math.min(100, Math.max(0, d.score)),
          rationale: d.rationale,
          recommendedAction: d.recommendedAction,
          aiModel: "gpt-4o" as const,
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
            aiModel: "gpt-4o" as const,
          })) as EvidenceItem[],
        }));

      return {
        ...buildProviderResult("openai-gpt4o", findings),
        reviewComment: parsed.reviewComment,
        keyRisk: parsed.keyRisk,
        rawImprovementSteps: parsed.improvementSteps,
        rawWorstCaseScenarios: parsed.worstCaseScenarios,
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
      };
    } catch (error) {
      console.error("OpenAI provider error:", error);
      const fallback = await new MockSanctionsProvider().run(caseRecord);
      return {
        ...buildProviderResult("openai-gpt4o", fallback.findings),
        status: "partial" as const,
        errors: [error instanceof Error ? error.message : "OpenAI error"],
        providerStatus: "fallback-error" as const,
        providerStatusLabel: "フォールバック",
        providerReason: error instanceof Error ? error.message : "OpenAI error",
      };
    }
  }
}
