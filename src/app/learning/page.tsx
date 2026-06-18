import Link from "next/link";

import { Shell } from "@/components/layout/shell";

const guides = [
  {
    title: "初めての輸出で最初に確認する5項目",
    description: "製品・輸出先国・相手企業・用途・契約条件の5つを順に確認するだけで、初動ミスを減らせます。",
  },
  {
    title: "よくある失敗例：用途確認不足",
    description: "『製品は問題ないと思った』だけで進めず、最終用途証明・需要者確認まで取る重要性を整理します。",
  },
  {
    title: "営業担当向け：規制資料の読み方",
    description: "専門資料を全部読むのではなく、自社に関係する箇所をどう切り分けるかを学べます。",
  },
];

export default function LearningPage() {
  return (
    <Shell
      title="学習コンテンツ"
      description="輸出初心者向けのガイド、よくある失敗例、実務で最初に見るポイントを整理しています。"
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="trade-glass-card rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Beginner guide</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">輸出初心者向けガイド</h2>
          <div className="mt-5 space-y-4">
            {guides.map((guide) => (
              <div key={guide.title} className="trade-soft-block p-5">
                <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="trade-glass-card rounded-[1.75rem] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Next action</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">次にやること</h2>
          <div className="mt-4 space-y-3">
            {[
              "専門用語は輸出辞典で確認する",
              "不明点はAI相談室で噛み砕いて相談する",
              "具体案件はAIリスク診断で一次確認する",
            ].map((item) => (
              <div key={item} className="trade-soft-block px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/glossary" className="trade-primary-button">
              輸出辞典を見る
            </Link>
            <Link href="/ai-room" className="trade-secondary-button">
              AI相談室へ
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
