/**
 * 規制アップデート記事のデータモデルとサンプル記事。
 *
 * 記事を追加するときは、下記の「執筆テンプレート」のフィールドを
 * すべて埋めてから `REGULATION_ARTICLES` に追加してください。
 * 内容は正確性を重視し、不確実な情報や具体的な数値は載せない方針です。
 */

export type RegulationArticleCategory =
  | "制裁"
  | "品目規制"
  | "手続き"
  | "技術提供"
  | "キャッチオール";

export type RegulationArticleRegion =
  | "日本"
  | "米国"
  | "EU"
  | "国際"
  | "複数地域";

export type RegulationArticle = {
  /** 一意な識別子（URLアンカーやキーに使用） */
  id: string;
  /** 記事タイトル（結論を端的に） */
  title: string;
  /** 記事の分類 */
  category: RegulationArticleCategory;
  /** 対象地域 */
  region: RegulationArticleRegion;
  /** 公開日（YYYY-MM-DD） */
  publishedAt: string;
  /** 1〜2文のサマリー */
  summary: string;
  /** 実務（案件判断）への影響 */
  impact: string;
  /** 押さえておきたいポイント（3件前後） */
  keyPoints: string[];
  /** 検索・関連付け用のタグ */
  tags: string[];
  /** 関連ページへの内部リンク */
  relatedLinks: { label: string; href: string }[];
};

/** 執筆テンプレート（新規記事はこの形で追加する） */
export const ARTICLE_TEMPLATE: RegulationArticle = {
  id: "example-id",
  title: "記事タイトル（結論を端的に）",
  category: "品目規制",
  region: "日本",
  publishedAt: "YYYY-MM-DD",
  summary: "1〜2文のサマリーを記述します。",
  impact: "案件判断への影響（何をいつまでに確認すべきか）を記述します。",
  keyPoints: [
    "押さえておきたいポイント1",
    "押さえておきたいポイント2",
    "押さえておきたいポイント3",
  ],
  tags: ["タグ1", "タグ2"],
  relatedLinks: [{ label: "関連ページ", href: "/learning" }],
};

export const REGULATION_ARTICLES: RegulationArticle[] = [
  {
    id: "economic-security",
    title: "経済安全保障の観点から輸出管理の確認が強化されています",
    category: "手続き",
    region: "日本",
    publishedAt: "2026-06-01",
    summary:
      "先端品目や機微な部品の輸出では、用途・需要者の確認と証跡の残し方がより重要になっています。",
    impact:
      "営業段階で用途確認書や最終需要者情報の取得を前倒しし、社内審査の証跡を残す運用が求められます。",
    keyPoints: [
      "該非判定の結果と根拠（パラメータシート）を案件ごとに保存する",
      "最終用途・エンドユーザーの確認を書面で残す",
      "再受注時も最新の規制・制裁状況を再確認する",
    ],
    tags: ["該非判定", "エンドユーザー", "最終用途", "証跡管理"],
    relatedLinks: [
      { label: "該非判定の用語解説", href: "/glossary#%E8%A9%B2%E9%9D%9E%E5%88%A4%E5%AE%9A" },
      { label: "学習コンテンツ", href: "/learning" },
    ],
  },
  {
    id: "sanctions-monitoring",
    title: "制裁対象国・制裁対象企業は継続的に更新されます",
    category: "制裁",
    region: "国際",
    publishedAt: "2026-05-12",
    summary:
      "制裁リストは頻繁に更新されるため、過去に問題がなかった顧客でも案件ごとの再確認が必要です。",
    impact:
      "再受注時には最新の制裁スクリーニングを行い、社名の表記揺れも考慮した照合が求められます。",
    keyPoints: [
      "取引開始時と定期の両方で制裁スクリーニングを実施する",
      "制裁リストは頻繁に更新されるため、常に最新版で照合する",
      "第三国経由の迂回取引リスクにも注意する",
    ],
    tags: ["制裁", "スクリーニング", "SDN", "迂回リスク"],
    relatedLinks: [
      { label: "制裁スクリーニングの用語解説", href: "/glossary#%E5%88%B6%E8%A3%81%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%B0" },
      { label: "安全保障ページ", href: "/security" },
    ],
  },
  {
    id: "deemed-export",
    title: "技術提供・みなし輸出への注意が高まっています",
    category: "技術提供",
    region: "日本",
    publishedAt: "2026-04-20",
    summary:
      "図面・仕様書・ソースコードなどの技術情報の提供が、物の輸出と同様に規制対象となるケースへの注意が高まっています。",
    impact:
      "国内の外国人技術者への技術開示や、海外拠点との技術共有も「みなし輸出」として管理対象に含めて確認する必要があります。",
    keyPoints: [
      "技術情報の提供も貨物の輸出と同様に規制対象となり得る",
      "社内の外国籍社員への技術開示は「みなし輸出」に該当し得る",
      "共有する情報の範囲と相手先を事前に確認する",
    ],
    tags: ["みなし輸出", "技術提供", "外為法"],
    relatedLinks: [
      { label: "みなし輸出の用語解説", href: "/glossary#%E3%81%BF%E3%81%AA%E3%81%97%E8%BC%B8%E5%87%BA" },
      { label: "技術提供の用語解説", href: "/glossary#%E6%8A%80%E8%A1%93%E6%8F%90%E4%BE%9B" },
    ],
  },
  {
    id: "dual-use-classification",
    title: "デュアルユース品目の該非判定精度が求められています",
    category: "品目規制",
    region: "複数地域",
    publishedAt: "2026-03-10",
    summary:
      "高性能部品や制御機器は、用途次第で規制対象となる可能性があるため、仕様に基づく該非判定の精度が重要です。",
    impact:
      "型番・仕様・用途をまとめた上で、該非判定とキャッチオール規制の両面から確認する運用が求められます。",
    keyPoints: [
      "仕様・性能データをもとに該非判定を行う",
      "リスト非該当でもキャッチオール規制の観点で用途を確認する",
      "判定結果と根拠をパラメータシートに残す",
    ],
    tags: ["該非判定", "キャッチオール規制", "デュアルユース"],
    relatedLinks: [
      { label: "該非判定の進め方", href: "/learning" },
      { label: "キャッチオール規制の用語解説", href: "/glossary#%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81%E3%82%AA%E3%83%BC%E3%83%AB%E8%A6%8F%E5%88%B6" },
    ],
  },
];
