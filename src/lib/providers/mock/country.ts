import type { InvestigationProvider } from "@/lib/providers/types";
import { buildモックFinding, buildProviderResult } from "@/lib/providers/mock/base";
import type { CaseRecord } from "@/lib/types";

const countryRiskScoreMap: Record<string, number> = {
  ベトナム: 37,
  インド: 44,
  中国: 62,
  ロシア: 90,
  ミャンマー: 86,
};

export class モックCountryProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    const countryScore = countryRiskScoreMap[caseRecord.destinationCountry] ?? 52;

    return buildProviderResult("mock-country", [
      buildモックFinding({
        dimension: "country",
        label: "国リスク",
        baseScore: countryScore,
        rationale:
          "政治・規制・地政学の変動を踏まえ、追加モニタリングが必要な国です。",
        recommendedAction:
          "案件受注後も制裁・法令改正・政情ニュースを継続監視してください。",
        evidence: [
          {
            title: "国別安定性の確認",
            summary: `${caseRecord.destinationCountry} は一定の事業機会がある一方、規制変化の監視が必要です。`,
            sourceName: "モック Country Risk Index",
            sourceType: "country",
            confidence: 0.74,
            riskLevel: countryScore >= 70 ? "high" : "medium",
          },
        ],
      }),
      buildモックFinding({
        dimension: "useCase",
        label: "用途リスク",
        baseScore: 54,
        rationale:
          "製品特性上、産業用途として妥当でも軍民両用解釈の余地があります。",
        recommendedAction:
          "仕様書と最終用途確認書をセットで回収してください。",
        evidence: [
          {
            title: "高精度部品の転用余地",
            summary: "高精度駆動部品はドローンや自動制御用途との切り分け確認が重要です。",
            sourceName: "モック Dual-use Bulletin",
            sourceType: "country",
            confidence: 0.79,
            riskLevel: "medium",
          },
        ],
      }),
    ]);
  }
}