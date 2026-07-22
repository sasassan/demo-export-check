import type { InvestigationProvider } from "@/lib/providers/types";
import { buildモックFinding, buildProviderResult } from "@/lib/providers/mock/base";
import type { CaseRecord } from "@/lib/types";

export class モックCompanyProvider implements InvestigationProvider {
  async run(caseRecord: CaseRecord) {
    return buildProviderResult("mock-company", [
      buildモックFinding({
        dimension: "endUser",
        label: "エンドユーザーリスク",
        baseScore: 49,
        rationale:
          "企業実在性は確認できる一方、最終需要先の情報が不足しています。",
        recommendedAction:
          "顧客の主要製品、納入先、Webサイト会社概要を取得してください。",
        evidence: [
          {
            title: "企業実在性確認",
            summary: `${caseRecord.customerCompanyName} は一般的な事業実態が確認できる想定です。`,
            sourceName: "モック Company Intel",
            sourceType: "company",
            confidence: 0.8,
            riskLevel: "low",
          },
        ],
      }),
      buildモックFinding({
        dimension: "ubo",
        label: "UBO調査",
        baseScore: 40,
        rationale:
          "株主構成に高リスク情報は見当たりませんが、実質支配者の裏付け資料は不足しています。",
        recommendedAction:
          "登記情報、株主一覧、代表者情報の入手を推奨します。",
        evidence: [
          {
            title: "株主情報の粒度不足",
            summary: "公開情報ベースでは最終支配者までは特定しきれていません。",
            sourceName: "モック Ownership Registry",
            sourceType: "company",
            confidence: 0.68,
            riskLevel: "medium",
          },
        ],
      }),
      buildモックFinding({
        dimension: "peps",
        label: "PEPs調査",
        baseScore: 28,
        rationale:
          "政治的重要人物との明確な関連は確認されていません。",
        recommendedAction:
          "取締役・主要株主の氏名表記を確定させて再検索してください。",
        evidence: [
          {
            title: "PEPs一次検索",
            summary: "重大一致は確認されていません。",
            sourceName: "モック PEP Registry",
            sourceType: "company",
            confidence: 0.77,
            riskLevel: "low",
          },
        ],
      }),
    ]);
  }
}