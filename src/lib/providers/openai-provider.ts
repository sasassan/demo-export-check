import type OpenAI from "openai";
import { buildAnalysisPrompt, parseAiResponse } from "@/lib/providers/ai-prompt";
import { buildProviderResult } from "@/lib/providers/mock/base";
import { モックSanctionsProvider } from "@/lib/providers/mock/sanctions";
import { モックCompanyProvider } from "@/lib/providers/mock/company";
import type { InvestigationProvider } from "@/lib/providers/types";
import type { CaseRecord, InvestigationFinding, EvidenceItem } from "@/lib/types";
import { createId } from "@/lib/utils";
import type { RiskDimension } from "@/lib/constants";
import { RISK_DIMENSIONS } from "@/lib/constants";
import { getProviderRuntimeInfo } from "@/lib/ai/config";
import { callWithRetry, logAiError } from "@/lib/ai/error-handling";
import { createOpenAiClient } from "@/lib/ai/client-factory";

export class OpenAIProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const runtime = getProviderRuntimeInfo("gpt-4o", "analysis");
    const apiKey = runtime.apiKey;
    if (runtime.status !== "live" || !apiKey) {
      const fallback = await Promise.all([
        new モックSanctionsProvider().run(caseRecord),
        new モックCompanyProvider().run(caseRecord),
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
      const client = createOpenAiClient(runtime);
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content:
            "あなたは輸出コンプライアンスの専門アナリストです。JSON形式のみで回答してください。",
        },
        {
          role: "user",
          content: buildAnalysisPrompt(caseRecord),
        },
      ];

      const callOnce = () =>
        callWithRetry(
          () =>
            client.chat.completions.create({
              model: runtime.modelName,
              messages,
              response_format: { type: "json_object" },
              temperature: 0.2,
            }),
          { providerLabel: "openai-gpt4o" },
        );

      let response = await callOnce();
      let text = response.choices[0]?.message?.content ?? "";
      let parsed = parseAiResponse(text);
      if (!parsed) {
        // JSONパース失敗時は1回だけリトライしてからフォールバックへ
        console.error("[AI:openai-gpt4o] JSONパース失敗のため1回リトライします");
        response = await callOnce();
        text = response.choices[0]?.message?.content ?? "";
        parsed = parseAiResponse(text);
      }
      if (!parsed) throw new Error("GPT-4o: JSON parse failed after retry");

      // 実際にAPIが呼び出したモデル名（例: "gpt-4o-mini-2024-07-18"）。
      // runtime.modelName（設定値）ではなく、APIレスポンス自体が返す値を使うことで
      // 表示ラベルの固定文言("GPT-4o")と実モデルの乖離をUIで補足できるようにする。
      const actualModelName = response.model;

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
        actualModelName,
      };
    } catch (error) {
      const classified = logAiError("openai-gpt4o", error);
      const fallback = await new モックSanctionsProvider().run(caseRecord);
      return {
        ...buildProviderResult("openai-gpt4o", fallback.findings),
        status: "partial" as const,
        errors: [classified.message],
        providerStatus: "fallback-error" as const,
        providerStatusLabel: "AI応答に失敗したため簡易判定を表示しています",
        providerReason: `${classified.kind} (status: ${classified.status ?? "n/a"}) ${classified.message}`,
      };
    }
  }
}
