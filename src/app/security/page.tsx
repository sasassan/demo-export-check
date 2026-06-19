import Link from "next/link";

import { Header } from "@/components/layout/header";

const securityItems = [
  {
    title: "通信の暗号化（SSL/TLS）",
    description:
      "ブラウザとサービス間の通信は暗号化を前提とし、第三者による盗聴・改ざんリスクの低減を図ります。",
  },
  {
    title: "データ保存ポリシー",
    description:
      "案件情報・相談履歴は、業務利用に必要な範囲で保存されます。将来的には企業ごとの保存期間設定にも対応予定です。",
  },
  {
    title: "AI学習への利用方針",
    description:
      "入力情報を外部AIの学習に利用させない構成を基本方針とし、利用モデル・契約条件に応じて明確に案内します。",
  },
  {
    title: "匿名化による利用方法",
    description:
      "企業名・型番・図面番号などを伏せた状態でも相談・一次確認しやすい導線を用意し、詳細情報の入力を最小限に抑えます。",
  },
  {
    title: "NDA締結対応",
    description:
      "法人導入時には、必要に応じて秘密保持契約（NDA）を前提とした導入相談に対応します。",
  },
  {
    title: "データ削除ポリシー",
    description:
      "案件・相談履歴の削除方針、契約終了時のデータ取り扱い、バックアップの扱いについて明示できるようにします。",
  },
  {
    title: "専用環境（将来対応）",
    description:
      "法人向けには、将来的に専用環境・アクセス制御・利用監査を含む運用オプションを提供予定です。",
  },
];

const aiUsageGuidelines = [
  "図面・製造条件・配合・未公開技術など、技術提供に該当し得る情報は安易にそのまま入力しない",
  "まずは匿名化・抽象化した表現で相談し、必要最小限の情報で判断できるかを確認する",
  "製品仕様が機微情報に当たる場合は、社内輸出管理担当・法務・専門家へ事前相談する",
  "詳細仕様を入れなくても、用途・輸出先国・相手先・契約条件だけで整理できるケースは多い",
  "AI相談室は判断補助であり、法的結論を確定するものではない",
];

export default function SecurityPage() {
  return (
    <main className="trade-surface trade-dashboard-bg min-h-screen bg-[#06111f] text-slate-100">
      <Header />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <section className="trade-glass-card rounded-[1.9rem] p-6 sm:p-8">
          <span className="trade-section-label">Security & Compliance</span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">セキュリティ・コンプライアンス</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            企業導入で重視される「情報の取り扱い」「AI入力の安全性」「外為法・技術提供への懸念」に対して、
            本サービスの基本的な考え方を分かりやすく整理しています。
          </p>
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900">
            図面・詳細仕様・製造条件などの入力が外為法上の技術提供に該当するかは、案件ごとに判断が分かれる場合があります。
            機微情報の入力前には、必ず社内輸出管理担当・法務・専門家へ相談してください。
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {securityItems.map((item) => (
            <div key={item.title} className="trade-glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="trade-glass-card rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">AI利用ガイドライン</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">入力前に確認したいポイント</h2>
            <ul className="mt-5 space-y-3">
              {aiUsageGuidelines.map((item) => (
                <li key={item} className="trade-soft-block flex items-start gap-3 px-4 py-3 text-sm leading-7 text-slate-700">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="trade-dark-panel rounded-2xl px-6 py-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">法人導入向け相談</p>
            <h2 className="mt-3 text-2xl font-bold">セキュリティ要件・NDA・運用ルールも相談可能</h2>
            <p className="mt-4 text-sm leading-7 text-slate-200">
              導入前の稟議・情報システム部門確認・法務レビューに必要な説明を、段階的に整理できるようにします。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact?v=security" className="trade-primary-button !bg-white !text-indigo-700">
                導入について相談する
              </Link>
              <Link href="/ai-room?v=security" className="trade-secondary-button !border-white/20 !bg-white/10 !text-white">
                AI相談室で確認する
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
