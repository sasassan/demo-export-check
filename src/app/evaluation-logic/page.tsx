import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/header";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: `評価ロジック | ${APP_NAME}`,
  description:
    "Export Risk Navi のA/B/C評価ロジック、8つの判定観点、スコア閾値、総合判定の考え方を説明するページです。",
};

const thresholdRows = [
  {
    score: "0–39",
    grade: "A",
    meaning: "低リスク帯。公開情報上では大きな懸念が少なく、標準確認を中心に進める想定です。",
  },
  {
    score: "40–69",
    grade: "B",
    meaning: "追加確認が必要な中間帯。営業判断だけで進めず、資料回収や社内レビューを推奨します。",
  },
  {
    score: "70–100",
    grade: "C",
    meaning: "高リスク帯。制裁・用途・相手先・国リスクなどの重大論点があり、慎重な確認が必要です。",
  },
];

const dimensions = [
  { key: "sanctions", label: "制裁リスク", note: "OFAC、EU、国連、日本関連制裁などとの照合観点" },
  { key: "endUser", label: "エンドユーザー実在性", note: "企業実在性、所在地、事業内容、取引先の自然さ" },
  { key: "ubo", label: "UBOリスク", note: "実質的支配者に関する不透明性や制裁該当懸念" },
  { key: "peps", label: "PEPsリスク", note: "政治的影響力のある人物との関係性リスク" },
  { key: "country", label: "国リスク", note: "輸出先国の制裁、紛争、政情、輸出規制の観点" },
  { key: "useCase", label: "用途リスク", note: "用途説明の整合性、最終用途、軍民転用懸念" },
  { key: "catchAll", label: "キャッチオール観点", note: "大量破壊兵器・軍事転用等の追加確認観点" },
  { key: "reputation", label: "企業信用・評判", note: "不審情報、風評、公開情報上の違和感" },
];

const categoryRows = [
  {
    title: "総合評価",
    formula: "8観点のうち最も重いグレードを採用",
    example: "1つでもCがあれば総合C、CがなくBがあれば総合B",
  },
  {
    title: "安全保障リスク",
    formula: "sanctions / endUser / catchAll / useCase の最大グレード",
    example: "制裁A・用途B・キャッチオールA → 安全保障リスクはB",
  },
  {
    title: "信用リスク",
    formula: "ubo / peps / reputation の最大グレード",
    example: "UBO B・PEPs A・評判A → 信用リスクはB",
  },
  {
    title: "物流・地政学リスク",
    formula: "country / reputation の最大グレード",
    example: "国リスクB・評判A → 物流・地政学リスクはB",
  },
];

const nextActionRules = [
  "各観点には rationale（理由）と recommendedAction（推奨確認アクション）を付与",
  "A以外の観点から、優先度の高いアクションを最大3件まで抽出して表示",
  "PDFレポートや詳細画面では、根拠・エビデンス・確認すべき資料をあわせて提示",
];

const flowSteps = [
  { title: "8観点で確認", body: "制裁、相手先、UBO、PEPs、国、用途、キャッチオール、企業信用を観点別に整理" },
  { title: "スコア化", body: "各観点を 0〜100 のリスクスコアに変換し、A / B / C にマッピング" },
  { title: "カテゴリ集約", body: "安全保障 / 信用 / 地政学などのカテゴリへ最大グレードで集約" },
  { title: "総合判定", body: "最も重いグレードを総合判定として採用し、推奨アクションを提示" },
];

const exampleCase = {
  title: "サーボモーター → ベトナムの公開デモ例",
  summary:
    "制裁はA、用途もAですが、企業信用と国リスクがBのため、営業単独で進めず追加確認を推奨する総合Bになります。",
  drivers: [
    "企業信用: 類似名称企業の存在、法人情報の裏取り不足",
    "国リスク: 地政学・物流・規制変動を踏まえて中間リスク",
    "用途: 産業機械として説明可能でA",
  ],
};

export default function EvaluationLogicPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Scoring logic</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            評価ロジック
          </h1>
          <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">
            {APP_NAME} では、輸出案件を 8つの観点で整理し、それぞれにスコアと A / B / C グレードを付与します。
            ここでのスコアは「高いほど安全」ではなく、
            <span className="font-semibold text-slate-900"> 高いほどリスクが強い </span>
            設計です。
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">スコアとグレードの対応</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {thresholdRows.map((row) => (
              <div key={row.grade} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{row.score}</p>
                  <span className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm font-bold text-slate-900">
                    {row.grade}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{row.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">How scoring works</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">ひと目で分かる判定フロー</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            {flowSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1e3a5f]">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">8つの判定観点</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dimensions.map((item) => (
              <div key={item.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1e3a5f]">
                  {item.key}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">カテゴリ別の集約方法</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {categoryRows.map((row) => (
              <div key={row.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold text-slate-900">{row.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  <span className="font-semibold">集約方法:</span> {row.formula}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <span className="font-semibold">例:</span> {row.example}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Next actions</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">推奨アクションの出し方</h2>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-700">
              {nextActionRules.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">Important note</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">重要な前提</h2>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              この評価ロジックは、営業段階・一次確認段階で論点を整理しやすくすることを目的としたものです。
              外為法上の最終判断や、法的助言・適法性保証を行うものではありません。
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <span className="trade-section-label">Worked example</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">公開デモの具体例</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">{exampleCase.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{exampleCase.summary}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">総合Bになる主な理由</p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
                {exampleCase.drivers.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap gap-3">
            <Link href="/demo" className="trade-primary-button">
              公開デモを見る
            </Link>
            <Link href="/operator" className="trade-secondary-button">
              運営情報
            </Link>
            <Link href="/supervision" className="trade-secondary-button">
              監修・レビュー体制
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}