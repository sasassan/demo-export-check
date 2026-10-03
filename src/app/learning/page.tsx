import Link from "next/link";

import { Shell } from "@/components/layout/shell";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "学習コンテンツ",
  description:
    "輸出管理の基礎、該非判定の進め方、よくある違反事例と対策、日本・米国・EUの規制比較まで、輸出管理の実務理解を段階的に支援する学習コンテンツです。",
  path: "/learning",
  keywords: ["輸出管理", "該非判定", "違反事例", "規制比較", "キャッチオール規制"],
});

type Guide = {
  id: string;
  label: string;
  title: string;
  description: string;
  steps: string[];
  related: { label: string; href: string }[];
};

const guides: Guide[] = [
  {
    id: "basics",
    label: "Beginner guide",
    title: "輸出管理の基礎（初心者向けガイド）",
    description:
      "輸出管理とは、国際的な平和と安全を守るため、機微な貨物・技術の輸出を国が管理する仕組みです。最初は「何を・どこへ・誰に・何に使うか」の4つの観点を押さえるだけで、初動のつまずきを大きく減らせます。",
    steps: [
      "製品（貨物・技術）が輸出規制の対象かを確認する（該非判定）",
      "輸出先国が制裁対象国・懸念国に含まれていないか確認する",
      "相手企業が制裁リスト・懸念リストに掲載されていないか調べる",
      "用途が軍事・大量破壊兵器（WMD）開発に転用される恐れがないか検討する",
      "契約書に再輸出禁止条項・最終用途制限が含まれているか確認する",
    ],
    related: [
      { label: "該非判定の用語解説", href: "/glossary#%E8%A9%B2%E9%9D%9E%E5%88%A4%E5%AE%9A" },
      { label: "デモで流れを体験", href: "/demo" },
      { label: "AI相談室で質問", href: "/ai-room" },
    ],
  },
  {
    id: "classification",
    label: "Step by step",
    title: "該非判定の進め方（ステップバイステップ）",
    description:
      "該非判定は、輸出する貨物・技術が輸出貿易管理令別表第1（リスト規制）に該当するかを判定する作業です。以下の手順で進め、結果を必ず文書に残します。",
    steps: [
      "輸出する貨物・技術のスペックを整理する（型番・仕様・性能値）",
      "輸出貿易管理令別表第1の該当しそうな品目番号の候補を絞り込む",
      "スペックと品目番号の要件（性能・仕様の閾値）を突き合わせて該当/非該当を判断する",
      "パラメータシート（該当性判定書）に判定結果と根拠を記録して証跡化する",
      "判断が難しい場合はCISTECや経済産業省への事前相談を活用する",
      "該当する場合は、輸出先・需要者に応じて必要な許可の種類（個別・包括）を検討する",
    ],
    related: [
      { label: "リスト規制の用語解説", href: "/glossary#%E3%83%AA%E3%82%B9%E3%83%88%E8%A6%8F%E5%88%B6" },
      { label: "該当性判定書とは", href: "/glossary#%E8%A9%B2%E5%BD%93%E6%80%A7%E5%88%A4%E5%AE%9A%E6%9B%B8" },
      { label: "デモで実務を体験", href: "/demo" },
    ],
  },
  {
    id: "violations",
    label: "Case studies",
    title: "よくある違反事例と対策",
    description:
      "輸出管理違反の多くは、意図的ではなく「確認の漏れ」から発生します。代表的な4つのパターンと、その防止策を押さえておきましょう。",
    steps: [
      "該非判定を怠り無許可で輸出してしまう → 全案件で該非判定を必須化し、判定結果を証跡として残す",
      "用途確認が不十分で軍事転用を許してしまう → 用途確認書・最終需要者証明書（EUC）を回収し、内容の妥当性まで審査する",
      "技術情報の提供が「みなし輸出」にあたることを見落とす → 図面・仕様書・ソースコードの海外提供を技術提供として管理する",
      "制裁対象者との取引に気づかない → 取引開始時と定期の両方で制裁スクリーニングを実施する",
    ],
    related: [
      { label: "みなし輸出の用語解説", href: "/glossary#%E3%81%BF%E3%81%AA%E3%81%97%E8%BC%B8%E5%87%BA" },
      { label: "赤旗シグナルを確認", href: "/glossary#%E8%B5%A4%E6%97%97%E3%82%B7%E3%82%B0%E3%83%8A%E3%83%AB" },
      { label: "最新の規制を確認", href: "/updates" },
    ],
  },
  {
    id: "comparison",
    label: "Country comparison",
    title: "各国規制の比較（日本 / 米国 / EU）",
    description:
      "輸出先国だけでなく、製品・技術の原産国や拠点の所在によって適用される規制が変わります。3つの主要な枠組みの違いを比較して押さえます。",
    steps: [
      "日本: 外為法＋輸出貿易管理令に基づき、リスト規制とキャッチオール規制の2本柱で輸出・技術提供を規制する",
      "米国: EAR（商務省）とITAR（国務省）が品目を分担し、米国原産品の再輸出やみなし輸出にまで広く域外適用される",
      "EU: デュアルユース規則（2021/821）により、EU共通リストの品目とキャッチオール条項で輸出を規制する",
      "実務では、自社製品の「原産地」「技術の出所」「輸出元拠点」に応じて複数規制を重ねて確認する",
    ],
    related: [
      { label: "EARの用語解説", href: "/glossary#ear" },
      { label: "ITARの用語解説", href: "/glossary#itar" },
      { label: "EU規制の用語解説", href: "/glossary#eu%E8%A6%8F%E5%88%B6" },
    ],
  },
];

const comparisonRows = [
  { label: "根拠法令", japan: "外為法・輸出貿易管理令", us: "EAR / ITAR", eu: "EUデュアルユース規則 (2021/821)" },
  { label: "所管機関", japan: "経済産業省", us: "商務省（BIS）/ 国務省", eu: "各加盟国の当局" },
  { label: "対象品目", japan: "リスト規制（別表第1）+ キャッチオール", us: "ECCN対象のデュアルユース / USMLの軍需品", eu: "EU共通リスト + キャッチオール" },
  { label: "特徴", japan: "包括許可制度・みなし輸出の概念", us: "再輸出・みなし輸出への広い域外適用", eu: "域内で統一された品目リスト" },
];

export default function LearningPage() {
  return (
    <Shell
      title="学習コンテンツ"
      description="輸出管理の基礎、該非判定、違反事例、各国比較を段階的に学べます。専門用語は輸出辞典で随時確認してください。"
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {guides.map((guide) => (
            <div key={guide.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">{guide.label}</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{guide.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{guide.description}</p>

              <ol className="mt-5 space-y-3">
                {guide.steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[11px] font-bold !text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex flex-wrap gap-2">
                {guide.related.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-blue-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Country comparison</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">日本・米国・EU 規制比較表</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="py-2 pr-3 font-semibold text-slate-500">観点</th>
                    <th className="py-2 pr-3 font-semibold text-slate-900">日本</th>
                    <th className="py-2 pr-3 font-semibold text-slate-900">米国</th>
                    <th className="py-2 font-semibold text-slate-900">EU</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-3 font-medium text-slate-500">{row.label}</td>
                      <td className="py-3 pr-3 text-slate-700">{row.japan}</td>
                      <td className="py-3 pr-3 text-slate-700">{row.us}</td>
                      <td className="py-3 text-slate-700">{row.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              上表は概要の比較です。実際の適用関係は品目・原産地・取引形態によって異なるため、専門家への確認をおすすめします。
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Next action</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">次にやること</h2>
            <div className="mt-4 space-y-3">
              {[
                "専門用語は輸出辞典で確認する",
                "不明点はAI相談室で噛み砕いて相談する",
                "デモで「入力 → 論点整理 → 結果確認」を体験する",
                "具体案件はAIリスク診断で一次確認する",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/glossary" className="trade-primary-button">
                輸出辞典を見る
              </Link>
              <Link href="/demo" className="trade-secondary-button">
                デモを体験する
              </Link>
              <Link href="/ai-room" className="trade-secondary-button">
                AI相談室へ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
