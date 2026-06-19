import type { AssessmentRecord } from "@/lib/types";

export const REGULATION_UPDATES: NonNullable<AssessmentRecord["regulationUpdates"]> = [
  {
    title: "経済安全保障・輸出管理の確認強化",
    summary: "高性能品目・先端部品の輸出時は、用途確認・需要者確認の証跡を残す運用がより重要になっています。",
    impact: "営業段階で用途確認書や最終需要者情報の取得を前倒しで進める必要があります。",
    sourceName: "Export Risk Navi Editorial",
    publishedAt: "2026-06-01",
    href: "/learning",
  },
  {
    title: "対ロ・対イラン等の制裁確認の重要性継続",
    summary: "制裁対象国・制裁対象企業は継続的に更新されるため、案件ごとの再確認が必要です。",
    impact: "過去に問題なかった顧客でも、再受注時には最新スクリーニングを行う必要があります。",
    sourceName: "Export Risk Navi Editorial",
    publishedAt: "2026-05-12",
    href: "/security",
  },
  {
    title: "技術提供・みなし輸出への注意喚起",
    summary: "図面・仕様書・ソースコード等の提供が技術提供に該当するケースへの注意が高まっています。",
    impact: "AI相談室や社内共有時も、詳細技術の入力範囲を見直し、匿名化方針を徹底する必要があります。",
    sourceName: "Export Risk Navi Editorial",
    publishedAt: "2026-04-20",
    href: "/about",
  },
];

export function getRegulationUpdatesForCase(input: {
  destinationCountry: string;
  productName: string;
}) {
  const updates = [...REGULATION_UPDATES];

  if (/中国|ロシア|イラン|北朝鮮|シリア/i.test(input.destinationCountry)) {
    updates.unshift({
      title: "高リスク国向け案件では事前確認を強化",
      summary: "懸念国向け輸出では、用途確認・経由地確認・顧客実在性確認の3点セットが重要です。",
      impact: "営業判断だけで進めず、社内輸出管理責任者のレビューを必須にしてください。",
      sourceName: "Export Risk Navi Editorial",
      publishedAt: "2026-06-10",
      href: "/learning",
    });
  }

  if (/モーター|半導体|センサー|装置|基板/i.test(input.productName)) {
    updates.unshift({
      title: "先端部品・装置系は該非判定の精度が重要",
      summary: "高精度部品や制御機器は、用途次第で規制対象となる可能性があります。",
      impact: "型番・仕様・用途をまとめた上で、該非判定とキャッチオール規制の両面確認が必要です。",
      sourceName: "Export Risk Navi Editorial",
      publishedAt: "2026-06-08",
      href: "/glossary",
    });
  }

  return updates.slice(0, 4);
}