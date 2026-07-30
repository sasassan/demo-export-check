import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { モックCountryProvider } from "@/lib/providers/mock/country";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { getProviderRuntimeInfo } from "@/lib/ai/config";
import { callWithRetry, logAiError } from "@/lib/ai/error-handling";

export class GeminiProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const runtime = getProviderRuntimeInfo("gemini", "analysis");
    const apiKey = runtime.apiKey;
    if (runtime.status !== "live" || !apiKey) {
      const fallback = await new モックCountryProvider().run(caseRecord);
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
      const model = genAI.getGenerativeModel(
        {
          model: runtime.modelName,
          generationConfig: { responseMimeType: "application/json" },
        },
        { timeout: runtime.timeoutMs },
      );

      const callOnce = () =>
        callWithRetry(
          () => model.generateContent(buildAnalysisPrompt(caseRecord)),
          { providerLabel: "google-gemini" },
        );

      let result = await callOnce();
      let text = result.response.text();
      let parsed = parseAiResponse(text);
      if (!parsed) {
        console.error("[AI:google-gemini] JSONパース失敗のため1回リトライします");
        result = await callOnce();
        text = result.response.text();
        parsed = parseAiResponse(text);
      }
      if (!parsed) throw new Error("Gemini: JSON parse failed after retry");

      // 注意: @google/generative-ai SDKのレスポンス(GenerateContentResponse)には
      // OpenAI/Anthropicと異なり実際に解決されたモデル名を返すフィールドが
      // 存在しない（usageMetadataのみ）。そのため設定値(runtime.modelName)を
      // そのまま使う。"gemini-flash-latest"等のエイリアス使用時は、実際に
      // 解決される具体的なモデルバージョンは判別できない点に留意。
      const actualModelName = runtime.modelName;

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
        actualModelName,
      };
    } catch (error) {
      const classified = logAiError("google-gemini", error);
      const fallback = await new モックCountryProvider().run(caseRecord);
      return {
        ...buildProviderResult("google-gemini", fallback.findings),
        status: "partial" as const,
        errors: [classified.message],
        providerStatus: "fallback-error" as const,
        providerStatusLabel: "AI応答に失敗したため簡易判定を表示しています",
        providerReason: `${classified.kind} (status: ${classified.status ?? "n/a"}) ${classified.message}`,
      };
    }
  }
}
