import type { InvestigationProvider } from "@/lib/providers/types";
import { buildMockFinding, buildProviderResult } from "@/lib/providers/mock/base";
import type { CaseRecord } from "@/lib/types";

export class MockSanctionsProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    return buildProviderResult("mock-sanctions", [
      buildMockFinding({
        dimension: "sanctions",
        label: "制裁リスク",
        baseScore: caseRecord.destinationCountry.includes("ロシア") ? 85 : 42,
        rationale:
          "現時点で明確な制裁一致は確認されていませんが、類似名称確認と最終顧客の再確認は必要です。",
        recommendedAction:
          "会社名の英字表記と親会社名を取得し、正式表記で再確認してください。",
        evidence: [
          {
            title: "制裁リスト一次確認",
            summary: "主要名称では一致なし。類似名称候補が少数存在します。",
            sourceName: "Mock Sanctions Watch",
            sourceType: "sanctions",
            confidence: 0.78,
            riskLevel: "medium",
            url: "https://example.com/sanctions",
          },
        ],
      }),
      buildMockFinding({
        dimension: "catchAll",
        label: "キャッチオール規制",
        baseScore: 58,
        rationale:
          "用途情報が不足しており、軍民両用判定の追加確認が必要です。",
        recommendedAction:
          "最終用途・設置先・使用設備の3点を取引先へ確認してください。",
        evidence: [
          {
            title: "用途未確定の注意",
            summary: "高精度モーターは転用可能性があるため用途確認が重要です。",
            sourceName: "Mock Compliance Rulebook",
            sourceType: "sanctions",
            confidence: 0.73,
            riskLevel: "medium",
          },
        ],
      }),
    ]);
  }
}