export const dynamic = "force-static";

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appUrl = rawAppUrl.replace(/\/$/, "");

const payload = {
  name: "Export Risk Navi",
  language: "ja",
  type: "website",
  summary:
    "中小企業向けの輸出リスク調査・評価Webアプリ。営業担当者が商談前に5分で一次確認できることを重視し、AI相談室で規制資料や社内規程の読解支援も提供する。",
  audience: [
    "営業担当者",
    "輸出管理の新任担当者",
    "管理部門",
    "法務・輸出管理担当者",
  ],
  coreFeatures: [
    "輸出案件の一次スクリーニング",
    "A/B/C リスク評価",
    "AIによる判定理由・次アクション提案",
    "PDFレポート出力",
    "AI相談室による資料要約・条文解説",
    "輸出辞典による専門用語解説",
  ],
  publicPages: [
    { name: "home", url: `${appUrl}/` },
    { name: "about", url: `${appUrl}/about` },
    { name: "demo", url: `${appUrl}/demo` },
    { name: "operator", url: `${appUrl}/operator` },
    { name: "supervision", url: `${appUrl}/supervision` },
    { name: "evaluation-logic", url: `${appUrl}/evaluation-logic` },
    { name: "glossary", url: `${appUrl}/glossary` },
    { name: "ai-room", url: `${appUrl}/ai-room` },
    { name: "learning", url: `${appUrl}/learning` },
    { name: "security", url: `${appUrl}/security` },
    { name: "training", url: `${appUrl}/training` },
    { name: "contact", url: `${appUrl}/contact` },
    { name: "for-ai", url: `${appUrl}/for-ai` },
    { name: "llms", url: `${appUrl}/llms.txt` },
  ],
  restrictedPages: [
    { name: "dashboard", path: "/dashboard" },
    { name: "cases", path: "/cases/*" },
  ],
  notes: [
    "法的助言サービスではなく、一次確認と理解支援を目的とする。",
    "公開ページはログインなしで閲覧可能。",
    "レビュー用途では /for-ai と /llms.txt を参照すると内容把握しやすい。",
  ],
};

export async function GET() {
  return Response.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}