import Link from "next/link";

import { Shell } from "@/components/layout/shell";

export const dynamic = "force-static";

const guides = [
  {
    id: "first-export",
    title: "初めての輸出で最初に確認する5項目",
    description: "製品・輸出先国・相手企業・用途・契約条件の5つを順に確認するだけで、初動ミスを減らせます。",
    details: [
      "1. 製品が輸出規制品目に該当するかを確認する（リスト規制・キャッチオール規制）",
      "2. 輸出先国が制裁対象国・懸念国に含まれていないか確認する",
      "3. 相手企業が制裁リスト・懸念リストに掲載されていないか調べる",
      "4. 用途が軍事・大量破壊兵器に転用される可能性がないか検討する",
      "5. 契約書に再輸出禁止条項・最終用途制限が含まれているか確認する",
    ],
  },
  {
    id: "common-mistakes",
    title: "よくある失敗例：用途確認不足",
    description: "『製品は問題ないと思った』だけで進めず、最終用途証明・需要者確認まで取る重要性を整理します。",
    details: [
      "製品スペックだけでは規制該当性を判断できない（用途で判定が変わる）",
      "口頭確認だけで用途確認書を取らないと、監査時に証跡が残らない",
      "再販目的の取引先は最終需要者が別にいるため、エンドユーザー確認が必要",
      "一度問題なしと判断しても、用途変更があれば再確認が必要",
    ],
  },
  {
    id: "reading-regulation",
    title: "営業担当向け：規制資料の読み方",
    description: "専門資料を全部読むのではなく、自社に関係する箇所をどう切り分けるかを学べます。",
    details: [
      "まず目次・適用範囲を確認し、自社製品のカテゴリを特定する",
      "該当する品目番号（ECCN・輸出令別表）だけを重点的に読む",
      "不明な専門用語はAI相談室や輸出辞典で確認する",
      "読んだ結論を社内メモに残し、上長確認へ回す",
    ],
  },
  {
    id: "internal-rules",
    title: "社内規程を読む時のポイント",
    description: "総則から順に読むのではなく、対象取引・承認フロー・必要証跡・相談先の4点に絞って確認する読み方を整理します。",
    details: [
      "対象取引: 自分の案件が規程の対象になるか（製品・国・金額の範囲）",
      "承認フロー: 誰に申請し、誰が承認するか（担当→管理者→責任者）",
      "必要証跡: どの書類を残す必要があるか（用途確認書・EUC・審査記録）",
      "相談先: 判断に迷った場合の社内窓口・外部専門家の連絡先",
    ],
  },
];

export default function LearningPage() {
  return (
    <Shell
      title="学習コンテンツ"
      description="輸出初心者向けのガイド、よくある失敗例、実務で最初に見るポイントを整理しています。"
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e3a5f]">Beginner guide</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">輸出初心者向けガイド</h2>
          <div className="mt-5 space-y-4">
            {guides.map((guide) => (
              <details key={guide.id} className="group rounded-lg border border-slate-200 bg-slate-50 p-5">
                <summary className="flex cursor-pointer items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p>
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </summary>
                <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm leading-7 text-slate-700">
                  {guide.details.map((detail) => (
                    <li key={detail}>・{detail}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <Link href="/ai-room" className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1e3a5f] hover:bg-blue-100">
                    AI相談室で深掘りする
                  </Link>
                  <Link href="/glossary" className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                    関連用語を確認する
                  </Link>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e3a5f]">Next action</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">次にやること</h2>
          <div className="mt-4 space-y-3">
            {[
              "専門用語は輸出辞典で確認する",
              "不明点はAI相談室で噛み砕いて相談する",
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
            <Link href="/ai-room" className="trade-secondary-button">
              AI相談室へ
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e3a5f]">Reading workflow</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">法令・規程の読解を進める手順</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            "1. PDFやURLをAI相談室へ入れる",
            "2. まず初心者向け説明で全体像を把握する",
            "3. 自社輸出への関係を判断させる",
            "4. 次に必要な確認事項を案件へ落とし込む",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600">
              {item}
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
