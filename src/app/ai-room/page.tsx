import { Shell } from "@/components/layout/shell";
import { AiRoomPanel } from "@/components/ai/ai-room-panel";
import { ConsultationHistory } from "@/components/ai/consultation-history";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "AI相談室",
  description:
    "輸出管理の規制資料、条文、社内規程、通達の読み方をAIに相談できます。初心者向けの言い換えや要点整理で、輸出コンプライアンスの理解を支援します。",
  path: "/ai-room",
});

export default function AiRoomPage() {
  return (
    <Shell
      title="AI相談室"
      description="輸出に関する疑問、規制資料の読み方、条文の意味、社内規程の整理、相手先確認、初心者向けの言い換え、資料の要点整理を、GPT-4o・Gemini・Claudeの3つのAIから選んで相談できます。"
    >
      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <AiRoomPanel />
          <ConsultationHistory />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">What you can ask</p>
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
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-tint-blue-bright bg-gradient-to-br from-slate-50 to-tint-blue p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Document support</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">法令・規程読解補助の使い方</h2>
            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <li>1. 法令・通達・ガイドライン・社内規程PDFを用意</li>
              <li>2. URL入力、文章貼り付け、またはPDFアップロードを行う</li>
              <li>3. 「初心者向けに説明」または「自社輸出への関係を判断」を選ぶ</li>
              <li>4. 要点・条文の意味・関係性・次に確認すべき点を確認</li>
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 bg-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Reading support</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">AIが補助できる読解ポイント</h2>
            <div className="mt-4 grid gap-3">
              {[
                "長文PDFの要点整理と重要箇所の抽出",
                "条文・通達の意味を平易な言葉で説明",
                "自社輸出に関係する箇所の切り分け",
                "実務で確認すべき次のアクションの提示",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-navy">Reliability</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">今回強化したAI機能</h2>
            <div className="mt-4 grid gap-3">
              {[
                "GPT-4o・Gemini・Claudeの3AIから回答者を選択",
                "根拠引用つき回答",
                "資料チャンク抽出による簡易RAG",
                "事実 / 要確認の切り分け",
                "回答評価フィードバック",
                "案件専用AI相談への引き継ぎ",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
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
