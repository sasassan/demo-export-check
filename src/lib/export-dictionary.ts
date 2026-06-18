export type ExportDictionaryEntry = {
  id: string;
  term: string;
  aliases?: string[];
  category: string;
  simpleExplanation: string;
  practicalUse: string;
  caution: string;
  relatedRisk: string;
  relatedFeatures: { label: string; href: string }[];
  referenceLinks?: { label: string; href: string }[];
};

export const EXPORT_DICTIONARY: ExportDictionaryEntry[] = [
  {
    id: "incoterms",
    term: "インコタームズ",
    aliases: ["Incoterms"],
    category: "貿易実務",
    simpleExplanation:
      "売主と買主のどちらが、輸送費・保険・通関・危険負担を持つかを定める国際ルールです。",
    practicalUse:
      "見積書・契約書・POで FOB、CIF、DAP などの条件を決める時に使います。",
    caution:
      "インコタームズは代金支払条件までは決めません。契約書では支払条件や責任範囲も別途確認が必要です。",
    relatedRisk:
      "通関責任や輸送事故時の責任分界が曖昧だと、物流トラブルや追加費用の原因になります。",
    relatedFeatures: [
      { label: "デモ画面を見る", href: "/demo" },
      { label: "デモ画面", href: "/demo" },
    ],
    referenceLinks: [{ label: "ICC Incoterms overview", href: "https://iccwbo.org/business-solutions/incoterms-rules/" }],
  },
  {
    id: "ear",
    term: "EAR",
    aliases: ["Export Administration Regulations"],
    category: "輸出規制",
    simpleExplanation:
      "米国の輸出管理規則で、デュアルユース品や米国由来技術の輸出・再輸出を管理します。",
    practicalUse:
      "米国製部品を含む製品を第三国へ輸出する際、許可が必要かを確認する場面で使います。",
    caution:
      "日本企業でも、米国原産品や米国技術を含む場合はEARの対象になることがあります。",
    relatedRisk:
      "EAR該当を見落とすと、許可なし輸出や再輸出違反につながるおそれがあります。",
    relatedFeatures: [
      { label: "輸出辞典", href: "/glossary#ear" },
      { label: "デモ画面を見る", href: "/demo" },
    ],
    referenceLinks: [{ label: "BIS EAR overview", href: "https://www.bis.gov/regulations/export-administration-regulations-ear" }],
  },
  {
    id: "eccn",
    term: "ECCN",
    aliases: ["Export Control Classification Number"],
    category: "輸出規制",
    simpleExplanation:
      "EAR上で品目を分類する番号で、どの規制に該当するかを判断する手がかりになります。",
    practicalUse:
      "自社製品や部品がどのカテゴリに入るか、メーカー仕様書や技術情報をもとに確認する時に使います。",
    caution:
      "ECCNは見た目で決められず、性能・技術仕様・暗号機能などの詳細確認が必要です。",
    relatedRisk:
      "ECCNの判定ミスは、輸出許可の見落としや申告誤りにつながります。",
    relatedFeatures: [
      { label: "該当品目確認の前提を学ぶ", href: "/glossary#eccn" },
      { label: "AI相談室で相談", href: "/ai-room" },
    ],
    referenceLinks: [{ label: "BIS CCL search", href: "https://www.bis.gov/regulations/commerce-control-list-ccl" }],
  },
  {
    id: "ubo",
    term: "UBO",
    aliases: ["Ultimate Beneficial Owner"],
    category: "相手先調査",
    simpleExplanation:
      "企業を実質的に支配している最終的な個人を指します。",
    practicalUse:
      "相手企業の背後にいる実質支配者が制裁対象や不審人物ではないか確認する時に使います。",
    caution:
      "表面上の会社名だけでは判断できず、持株構造や関係会社まで追う必要があります。",
    relatedRisk:
      "実質支配者が高リスク人物だと、見かけ上問題のない企業でも取引リスクが高まります。",
    relatedFeatures: [
      { label: "AI相談室で確認する", href: "/ai-room" },
      { label: "輸出辞典で確認", href: "/glossary#ubo" },
    ],
  },
  {
    id: "peps",
    term: "PEPs",
    aliases: ["Politically Exposed Persons"],
    category: "相手先調査",
    simpleExplanation:
      "政府高官や政治的影響力を持つ人物、その家族・関係者を指します。",
    practicalUse:
      "相手先や支配者が政府関係者に近い場合、通常より慎重な確認が必要か判断する時に使います。",
    caution:
      "PEPsだから即違法ではありませんが、贈収賄や腐敗リスクの観点で追加確認が必要です。",
    relatedRisk:
      "腐敗・不透明取引・制裁リスクの兆候を見落とす可能性があります。",
    relatedFeatures: [
      { label: "デモ画面を見る", href: "/demo" },
      { label: "AI相談室で質問", href: "/ai-room" },
    ],
  },
  {
    id: "catch-all",
    term: "キャッチオール規制",
    aliases: ["Catch-All"],
    category: "輸出規制",
    simpleExplanation:
      "規制リストに載っていない品目でも、軍事転用などの疑いがあれば輸出許可が必要になる考え方です。",
    practicalUse:
      "用途が曖昧、最終需要者が怪しい、高リスク国向けといった案件で確認します。",
    caution:
      "非該当品だから安全とは限りません。用途・需要者・最終仕向地の確認が重要です。",
    relatedRisk:
      "用途確認不足のまま出荷すると、違反や社内承認漏れの原因になります。",
    relatedFeatures: [
      { label: "AI相談室で整理する", href: "/ai-room" },
      { label: "初心者ガイド", href: "/learning" },
    ],
  },
];

export function searchDictionary(query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return null;

  return (
    EXPORT_DICTIONARY.find((entry) => {
      const targets = [entry.term, ...(entry.aliases ?? [])].map((item) => item.toLowerCase());
      return targets.some((item) => item.includes(keyword) || keyword.includes(item));
    }) ?? null
  );
}
