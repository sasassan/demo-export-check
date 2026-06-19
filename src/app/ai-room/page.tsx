import { Shell } from "@/components/layout/shell";
import { AiRoomPanel } from "@/components/ai/ai-room-panel";
import { ConsultationHistory } from "@/components/ai/consultation-history";

export default function AiRoomPage() {
  return (
    <Shell
      title="AI相談室"
      description="輸出に関する疑問、規制資料の読み方、条文の意味、社内規程の整理、相手先確認、初心者向けの言い換え、資料の要点整理をまとめて相談できます。"
    >
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <AiRoomPanel />
          <ConsultationHistory />
        </div>
        <div className="space-y-6">
          <div className="trade-glass-card rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">What you can ask</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">こんな相談に対応</h2>
            <div className="mt-4 space-y-3">
              {[
                "この規制資料を初心者向けに説明して",
                "この条文は営業担当として何を意味するの？",
                "社内規程のこの章で、現場は何をすべき？",
                "この文章が自社輸出に関係あるか判断したい",
                "ベトナム向け輸出で最初に確認すべき点は？",
                "相手先企業の信用確認で何から見るべき？",
                "用途確認書が必要そうか知りたい",
              ].map((item) => (
                <div key={item} className="trade-soft-block px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-cyan-200/40 bg-gradient-to-br from-cyan-50 to-indigo-50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Document support</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">法令・規程読解補助の使い方</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li>1. 法令・通達・ガイドライン・社内規程PDFを用意</li>
              <li>2. URL入力、文章貼り付け、またはPDFアップロードを行う</li>
              <li>3. 「初心者向けに説明」または「自社輸出への関係を判断」を選ぶ</li>
              <li>4. 要点・条文の意味・関係性・次に確認すべき点を確認</li>
            </ol>
          </div>

          <div className="trade-glass-card rounded-[1.75rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">Reading support</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">AIが補助できる読解ポイント</h2>
            <div className="mt-4 grid gap-3">
              {[
                "長文PDFの要点整理と重要箇所の抽出",
                "条文・通達の意味を平易な言葉で説明",
                "自社輸出に関係する箇所の切り分け",
                "実務で確認すべき次のアクションの提示",
              ].map((item) => (
                <div key={item} className="trade-soft-block px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
