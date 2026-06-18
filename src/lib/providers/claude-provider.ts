import Anthropic from "@anthropic-ai/sdk";
import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { MockCountryProvider } from "@/lib/providers/mock/country";
import { MockNewsProvider } from "@/lib/providers/mock/news";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";

export class ClaudeProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const fallback = await Promise.all([
        new MockCountryProvider().run(caseRecord),
        new MockNewsProvider().run(caseRecord),
      ]);
      const findings = fallback.flatMap((r) =>
        r.findings.map((f) => ({ ...f, aiModel: "mock" as const })),
      );
      return buildProviderResult("anthropic-claude", findings);
    }

    try {
      const client = new Anthropic({ apiKey });
      const response = await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        system:
          "あなたは輸出コンプライアンスの専門アナリストです。JSON形式のみで回答してください。余分なテキストは一切含めないでください。",
        messages: [
          {
            role: "user",
            content: buildAnalysisPrompt(caseRecord),
          },
        ],
      });

      const text =
        response.content[0]?.type === "text" ? response.content[0].text : "";
      const parsed = parseAiResponse(text);
      if (!parsed) throw new Error("Claude: JSON parse failed");

      const findings: InvestigationFinding[] = parsed.dimensions
        .filter((d) => RISK_DIMENSIONS.includes(d.dimension as RiskDimension))
        .map((d) => ({
          dimension: d.dimension as RiskDimension,
          label: d.label,
          baseScore: Math.min(100, Math.max(0, d.score)),
          rationale: d.rationale,
          recommendedAction: d.recommendedAction,
          aiModel: "claude" as const,
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
            aiModel: "claude" as const,
          })) as EvidenceItem[],
        }));

      return buildProviderResult("anthropic-claude", findings);
    } catch (error) {
      console.error("Claude provider error:", error);
      const fallback = await new MockCountryProvider().run(caseRecord);
      return {
        ...buildProviderResult("anthropic-claude", fallback.findings),
        status: "partial" as const,
        errors: [error instanceof Error ? error.message : "Claude error"],
      };
    }
  }
}
