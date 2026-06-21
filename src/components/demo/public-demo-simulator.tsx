"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type ScenarioId = "servo" | "chemical" | "semiconductor";

type Scenario = {
  id: ScenarioId;
  label: string;
  productName: string;
  modelNumber: string;
  destinationCountry: string;
  customerName: string;
  overallGrade: "A" | "B" | "C";
  overallSummary: string;
  cautionLabel: string;
  cautionBody: string;
  dimensions: Array<{
    label: string;
    grade: "A" | "B" | "C";
    score: number;
  }>;
  actions: string[];
  evidence: string[];
};

const scenarios: Scenario[] = [
  {
    id: "servo",
    label: "産業機械向けサーボモーター",
    productName: "高精度サーボモーター",
    modelNumber: "SRV-9800",
    destinationCountry: "ベトナム",
    customerName: "Hanoi Precision Robotics Co., Ltd.",
    overallGrade: "B",
    overallSummary:
      "用途は産業機械で説明可能ですが、相手先名称の表記揺れと最終用途証明の不足が残るため、営業段階では追加確認を推奨します。",
    cautionLabel: "要確認: 企業信用 / 最終用途",
    cautionBody:
      "類似名称企業の存在と、再輸出先の裏取りが不十分です。法人登記・最終需要先・用途確認書の回収が先です。",
    dimensions: [
      { label: "制裁", grade: "A", score: 95 },
      { label: "企業信用", grade: "B", score: 72 },
      { label: "国リスク", grade: "B", score: 68 },
      { label: "用途", grade: "A", score: 88 },
    ],
    actions: [
      "法人登記番号または会社登録証を入手",
      "最終用途証明書（EUC）を回収",
      "最終需要先と再輸出有無を再確認",
    ],
    evidence: [
      "制裁一次照合では明確な一致なし",
      "輸出先国は中程度の地政学リスク帯",
      "用途説明はあるが、需要先の裏取り資料が不足",
    ],
  },
  {
    id: "chemical",
    label: "化学品サンプル輸出",
    productName: "高純度フッ素系洗浄剤",
    modelNumber: "FC-210A",
    destinationCountry: "マレーシア",
    customerName: "Penang Surface Materials Sdn. Bhd.",
    overallGrade: "B",
    overallSummary:
      "一般産業用途の説明はあるものの、化学品の用途詳細と最終使用工程の確認が不足しており、社内承認前に追加ヒアリングが必要です。",
    cautionLabel: "要確認: 用途リスク / 書類整合性",
    cautionBody:
      "サンプル輸出であっても、工程用途・濃度・転売先の確認が必要です。SDSと用途説明の整合を必ず確認してください。",
    dimensions: [
      { label: "制裁", grade: "A", score: 93 },
      { label: "企業信用", grade: "A", score: 80 },
      { label: "国リスク", grade: "B", score: 70 },
      { label: "用途", grade: "B", score: 61 },
    ],
    actions: [
      "SDSと用途説明を照合",
      "最終使用工程と設備名を確認",
      "転売・第三国出荷の有無を確認",
    ],
    evidence: [
      "相手先の事業内容は表面処理材料で整合あり",
      "化学品は用途確認の粒度が不足すると誤判定リスクが高い",
      "サンプル名目でも実運用先の確認が必要",
    ],
  },
  {
    id: "semiconductor",
    label: "半導体製造関連装置",
    productName: "真空搬送制御ユニット",
    modelNumber: "VAC-4400",
    destinationCountry: "台湾",
    customerName: "Formosa Advanced Process Inc.",
    overallGrade: "A",
    overallSummary:
      "相手先の実在性と用途整合が比較的取りやすく、公開情報上も大きな懸念は見当たりません。標準確認を行ったうえで社内承認へ進める想定です。",
    cautionLabel: "標準確認で進行可能",
    cautionBody:
      "現時点で重大な赤信号はありませんが、最終仕様・最終需要先・再輸出条件は通常どおり確認してください。",
    dimensions: [
      { label: "制裁", grade: "A", score: 96 },
      { label: "企業信用", grade: "A", score: 86 },
      { label: "国リスク", grade: "A", score: 81 },
      { label: "用途", grade: "A", score: 84 },
    ],
    actions: [
      "標準の取引先確認フローを実施",
      "仕様書と顧客説明資料の整合性を確認",
      "最終需要先の記録をレポートに残す",
    ],
    evidence: [
      "輸出先国・相手先の公開情報に大きな懸念なし",
      "半導体用途の説明は比較的明確",
      "通常の社内証跡を残せば共有しやすい案件",
    ],
  },
];

const gradeClassMap = {
  A: "border-emerald-200 bg-emerald-50 text-emerald-700",
  B: "border-amber-300 bg-amber-50 text-amber-900",
  C: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

const gradeDescriptionMap = {
  A: "大きな懸念が少なく、標準確認を中心に進めやすい状態",
  B: "営業単独で進めず、追加確認や社内レビューを挟みたい状態",
  C: "重大論点があり、慎重な確認と上長・担当部門の関与が必要な状態",
} as const;

export function PublicDemoSimulator() {
  const [selectedId, setSelectedId] = useState<ScenarioId>("servo");
  const [runState, setRunState] = useState<"idle" | "loading" | "done">("done");
  const resultRef = useRef<HTMLDivElement | null>(null);

  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0];

  const [formState, setFormState] = useState({
    productName: selectedScenario.productName,
    modelNumber: selectedScenario.modelNumber,
    destinationCountry: selectedScenario.destinationCountry,
    customerName: selectedScenario.customerName,
  });

  const switchScenario = (scenario: Scenario) => {
    setSelectedId(scenario.id);
    setFormState({
      productName: scenario.productName,
      modelNumber: scenario.modelNumber,
      destinationCountry: scenario.destinationCountry,
      customerName: scenario.customerName,
    });
    setRunState("done");
  };

  const runDemo = () => {
    setRunState("loading");
    window.setTimeout(() => {
      setRunState("done");
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1200);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="trade-section-label">Interactive mock</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              公開デモで入力体験を再現
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              実案件データは公開していませんが、サンプルシナリオを使って
              「入力 → 論点整理 → 結果確認」の流れを体験できます。
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
            この結果はデモ用の固定サンプルです
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          {scenarios.map((scenario) => {
            const isActive = scenario.id === selectedId;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => switchScenario(scenario)}
                className={`rounded-lg border px-4 py-3 text-left transition ${
                  isActive
                    ? "border-[#1e3a5f] bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">
                  {scenario.label}
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  {scenario.productName} / {scenario.destinationCountry} /
                  総合 {scenario.overallGrade}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">商品名</span>
            <input
              value={formState.productName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  productName: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1e3a5f] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">型番</span>
            <input
              value={formState.modelNumber}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  modelNumber: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1e3a5f] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">輸出先国</span>
            <input
              value={formState.destinationCountry}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  destinationCountry: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1e3a5f] focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-800">顧客企業名</span>
            <input
              value={formState.customerName}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  customerName: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1e3a5f] focus:ring-4 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runDemo}
            data-cta-id="public-demo-run"
            data-cta-label="この条件でデモ判定を見る"
            className="trade-primary-button"
          >
            {runState === "loading" ? "AIが判定中..." : "この条件でデモ判定を見る"}
          </button>
          <p className="text-xs leading-6 text-slate-700">
            実運用ではここから AI が論点整理、根拠要約、PDF レポート化を行います。
          </p>
        </div>
      </section>

      <section ref={resultRef} className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="trade-section-label">Sample result</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              結果プレビュー
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              公開デモでは、Beta版で想定している出力イメージをサンプルで表示しています。
            </p>
          </div>
          <span
            className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${gradeClassMap[selectedScenario.overallGrade]}`}
          >
            総合 {selectedScenario.overallGrade}
          </span>
        </div>

        {runState === "loading" ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-[#1e3a5f]">
              条件をもとに論点を整理しています。実運用ではこの間に AI が確認ポイントと推奨アクションを生成します。
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
              <div className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {formState.productName} {formState.modelNumber} →{" "}
                {formState.destinationCountry}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-800">
                {selectedScenario.overallSummary}
              </p>
              <div className={`mt-3 rounded-lg border px-3 py-2 text-xs font-medium ${gradeClassMap[selectedScenario.overallGrade]}`}>
                {gradeDescriptionMap[selectedScenario.overallGrade]}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {selectedScenario.dimensions.map((dimension) => (
                <div
                  key={dimension.label}
                  className={`rounded-lg border p-3 text-center ${gradeClassMap[dimension.grade]}`}
                >
                  <p className="text-[11px] font-medium text-slate-700">
                    {dimension.label}
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {dimension.grade}
                  </p>
                  <p className="text-[11px] text-slate-700">
                    {dimension.score} 点
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                {selectedScenario.cautionLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                {selectedScenario.cautionBody}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  推奨アクション
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                  {selectedScenario.actions.map((action) => (
                    <li key={action}>- {action}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  根拠サマリー
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                  {selectedScenario.evidence.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-[48%]">
                  <p className="text-sm font-semibold text-slate-900">PDFレポートに含まれる内容</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-800">
                    <li>- 総合A/B/C評価とカテゴリ別の結果</li>
                    <li>- 判定理由と、どこが引っかかったかの要約</li>
                    <li>- 回収すべき資料、確認すべき項目、社内共有用の根拠</li>
                  </ul>
                </div>
                <div className="w-full rounded-lg border border-slate-200 bg-white p-4 lg:max-w-[44%]">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1e3a5f]">
                    PDF sample preview
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">1ページ目</p>
                      <p className="mt-1 text-xs leading-5 text-slate-700">総合評価、カテゴリ別スコア、案件サマリー</p>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">2ページ目</p>
                      <p className="mt-1 text-xs leading-5 text-slate-700">推奨アクション、根拠、回収資料、免責事項</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    この先の実運用イメージ
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    実案件では、ここからPDFレポート生成、案件保存、AI相談室への引き継ぎまで進められます。
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/evaluation-logic" data-cta-id="demo-result-logic" data-cta-label="評価ロジックを見る" data-cta-target="/evaluation-logic" className="trade-secondary-button">
                    評価ロジックを見る
                  </Link>
                  <Link href="/contact" data-cta-id="demo-result-contact" data-cta-label="デモ相談をする" data-cta-target="/contact" className="trade-primary-button">
                    デモ相談をする
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}