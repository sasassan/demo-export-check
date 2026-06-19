import Link from "next/link";

import { Header } from "@/components/layout/header";

const securityItems = [
  { title: "通信の暗号化（SSL/TLS）", description: "ブラウザとサービス間の通信は暗号化を前提とし、第三者による盗聴・改ざんリスクの低減を図ります。" },
  { title: "データ保存ポリシー", description: "案件情報・相談履歴は、業務利用に必要な範囲で保存されます。将来的には企業ごとの保存期間設定にも対応予定です。" },
  { title: "AI学習への利用方針", description: "入力情報を外部AIの学習に利用させない構成を基本方針とし、利用モデル・契約条件に応じて明確に案内します。" },
  { title: "匿名化による利用方法", description: "企業名・型番・図面番号などを伏せた状態でも相談・一次確認しやすい導線を用意し、詳細情報の入力を最小限に抑えます。" },
  { title: "NDA締結対応", description: "法人導入時には、必要に応じて秘密保持契約（NDA）を前提とした導入相談に対応します。" },
  { title: "データ削除ポリシー", description: "案件・相談履歴の削除方針、契約終了時のデータ取り扱い、バックアップの扱いについて明示できるようにします。" },
  { title: "専用環境（将来対応）", description: "法人向けには、将来的に専用環境・アクセス制御・利用監査を含む運用オプションを提供予定です。" },
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
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <span className="trade-section-label">Security & Compliance</span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">セキュリティ・コンプライアンス</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            企業導入で重視される「情報の取り扱い」「AI入力の安全性」「外為法・技術提供への懸念」に対して、
            本サービスの基本的な考え方を分かりやすく整理しています。
          </p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            図面・詳細仕様・製造条件などの入力が外為法上の技術提供に該当するかは、案件ごとに判断が分かれる場合があります。
            機微情報の入力前には、必ず社内輸出管理担当・法務・専門家へ相談してください。
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {securityItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="trade-section-label">AI Usage Guidelines</span>
            <h2 className="mt-3 text-xl font-bold text-slate-900">入力前に確認したいポイント</h2>
            <ul className="mt-4 space-y-2">
              {aiUsageGuidelines.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1e3a5f]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-[#1e3a5f] p-6 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider">Enterprise</span>
            <h2 className="mt-3 text-xl font-bold">セキュリティ要件・NDA・運用ルールも相談可能</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              導入前の稟議・情報システム部門確認・法務レビューに必要な説明を、段階的に整理できるようにします。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact?v=security" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-slate-100">導入について相談する</Link>
              <Link href="/ai-room?v=security" className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">AI相談室で確認する</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
