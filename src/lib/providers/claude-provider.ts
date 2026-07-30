import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { モックCountryProvider } from "@/lib/providers/mock/country";
import { モックNewsProvider } from "@/lib/providers/mock/news";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { getProviderRuntimeInfo } from "@/lib/ai/config";
import { callWithRetry, logAiError } from "@/lib/ai/error-handling";
import { createAnthropicClient } from "@/lib/ai/client-factory";

export class ClaudeProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const runtime = getProviderRuntimeInfo("claude");
    const apiKey = runtime.apiKey;
    if (runtime.status !== "live" || !apiKey) {
      const fallback = await Promise.all([
        new モックCountryProvider().run(caseRecord),
        new モックNewsProvider().run(caseRecord),
      ]);
      const findings = fallback.flatMap((r) =>
        r.findings.map((f) => ({ ...f, aiModel: "mock" as const })),
      );
      return {
        ...buildProviderResult("anthropic-claude", findings),
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
        providerReason: runtime.reason,
      };
    }

    try {
      const client = createAnthropicClient(runtime);
      const callOnce = () =>
        callWithRetry(
          () =>
            client.messages.create({
              model: runtime.modelName,
              max_tokens: 4096,
              system:
                "あなたは輸出コンプライアンスの専門アナリストです。JSON形式のみで回答してください。余分なテキストは一切含めないでください。",
              messages: [
                {
                  role: "user",
                  content: buildAnalysisPrompt(caseRecord),
                },
              ],
            }),
          { providerLabel: "anthropic-claude" },
        );

      let response = await callOnce();
      let text = response.content[0]?.type === "text" ? response.content[0].text : "";
      let parsed = parseAiResponse(text);
      if (!parsed) {
        console.error("[AI:anthropic-claude] JSONパース失敗のため1回リトライします");
        response = await callOnce();
        text = response.content[0]?.type === "text" ? response.content[0].text : "";
        parsed = parseAiResponse(text);
      }
      if (!parsed) throw new Error("Claude: JSON parse failed after retry");

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

      return {
        ...buildProviderResult("anthropic-claude", findings),
        reviewComment: parsed.reviewComment,
        keyRisk: parsed.keyRisk,
        rawImprovementSteps: parsed.improvementSteps,
        rawWorstCaseScenarios: parsed.worstCaseScenarios,
        providerStatus: runtime.status,
        providerStatusLabel: runtime.statusLabel,
      };
    } catch (error) {
      const classified = logAiError("anthropic-claude", error);
      const fallback = await new モックCountryProvider().run(caseRecord);
      return {
        ...buildProviderResult("anthropic-claude", fallback.findings),
        status: "partial" as const,
        errors: [classified.message],
        providerStatus: "fallback-error" as const,
        providerStatusLabel: "AI応答に失敗したため簡易判定を表示しています",
        providerReason: `${classified.kind} (status: ${classified.status ?? "n/a"}) ${classified.message}`,
      };
    }
  }
}
