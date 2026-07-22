import type { InvestigationProvider } from "@/lib/providers/types";
import { buildモックFinding, buildProviderResult } from "@/lib/providers/mock/base";
import type { CaseRecord } from "@/lib/types";

export class モックNewsProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    return buildProviderResult("mock-news", [
      buildモックFinding({
        dimension: "reputation",
        label: "ブランド毀損リスク",
        baseScore: 45,
        rationale:
          "重大ネガティブニュースは見当たりませんが、戦略物資関連と誤認される表現には注意が必要です。",
        recommendedAction:
          "公開資料や営業提案書で用途表現を具体化してください。",
        evidence: [
          {
            title: "ネガティブニュース限定的",
            summary: `${caseRecord.customerCompanyName} に関する重大な炎上情報は限定的です。`,
            sourceName: "モック News Monitor",
            sourceType: "news",
            confidence: 0.71,
            riskLevel: "low",
          },
        ],
      }),
    ]);
  }
}