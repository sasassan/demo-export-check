import Link from "next/link";

import { Header } from "@/components/layout/header";
import { buildSeo } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata = buildSeo({
  title: "セキュリティ・コンプライアンス方針",
  description:
    "SSL/TLS暗号化、データ保存ポリシー、AI学習への利用方針など、輸出リスクナビのセキュリティと輸出コンプライアンスに関する考え方を説明します。",
  path: "/security",
});

const securityItems = [
  {
    title: "通信の暗号化（SSL/TLS）",
    description: "ブラウザとサービス間の通信は暗号化を前提とし、第三者による盗聴・改ざんリスクの低減を図ります。",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253",
  },
  {
    title: "データ保存ポリシー",
    description: "案件情報・相談履歴は、業務利用に必要な範囲で保存されます。将来的には企業ごとの保存期間設定にも対応予定です。",
    icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
  },
  {
    title: "AI学習への利用方針",
    description: "入力情報を外部AIの学習に利用させない構成を基本方針とし、利用モデル・契約条件に応じて明確に案内します。",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  },
  {
    title: "匿名化による利用方法",
    description: "企業名・型番・図面番号などを伏せた状態でも相談・一次確認しやすい導線を用意し、詳細情報の入力を最小限に抑えます。",
    icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  },
  {
    title: "NDA締結対応",
    description: "法人導入時には、必要に応じて秘密保持契約（NDA）を前提とした導入相談に対応します。",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z",
  },
  {
    title: "データ削除ポリシー",
    description: "案件・相談履歴の削除方針、契約終了時のデータ取り扱い、バックアップの扱いについて明示できるようにします。",
    icon: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0",
  },
  {
    title: "専用環境（将来対応）",
    description: "法人向けには、将来的に専用環境・アクセス制御・利用監査を含む運用オプションを提供予定です。",
    icon: "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.925-2.885a1.5 1.5 0 0 1 1.248-.668h10.696a1.5 1.5 0 0 1 1.248.668l1.925 2.885a3.004 3.004 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-3.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z",
  },
];

const aiUsageGuidelines = [
  "図面・製造条件・配合・未公開技術など、技術提供に該当し得る情報は安易にそのまま入力しない",
  "まずは匿名化・抽象化した表現で相談し、必要最小限の情報で判断できるかを確認する",
  "製品仕様が機微情報に当たる場合は、社内輸出管理担当・法務・専門家へ事前相談する",
  "詳細仕様を入れなくても、用途・輸出先国・相手先・契約条件だけで整理できるケースは多い",
  "AI相談室は判断補助であり、法的結論を確定するものではない",
];

const dataSourcePolicy = [
  {
    title: "公開情報ベースの一次確認支援",
    description:
      "公開サイトでは、制裁リスト、企業公開情報、国リスク、用途リスクなどをもとに一次確認論点を整理する設計思想を明示しています。",
  },
  {
    title: "更新頻度は案件特性に応じて再確認が前提",
    description:
      "制裁・規制・地政学情報は更新され得るため、最終判断前には必ず最新情報の再確認が必要です。公開版もこの前提を維持しています。",
  },
  {
    title: "最終判断の代替ではない",
    description:
      "本サービスは一次スクリーニングと理解支援を目的とし、外為法上の最終判断や法的助言を代替するものではありません。",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main id="main-content" tabIndex={-1} className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10 outline-none">
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z" />
              </svg>
            </span>
            <span className="trade-section-label">Security & Compliance</span>
          </div>
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
            <div key={item.title} className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </span>
              <h2 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/60 to-white p-6">
          <span className="trade-section-label">Data source policy</span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">データソースと更新に関する考え方</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {dataSourcePolicy.map((item) => (
              <div key={item.title} className="trade-hover-lift rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-navy/30">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700">
            Beta版では、公開ページ上で「いつ・何を・どの粒度で確認すべきか」を分かりやすく提示することを重視しています。
            実務導入時には、制裁・規制情報の最新性、社内承認フロー、証跡管理の運用設計を含めて確認してください。
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-brand-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </span>
              <div>
                <span className="trade-section-label">AI Usage Guidelines</span>
                <h2 className="mt-1 text-xl font-bold text-slate-900">入力前に確認したいポイント</h2>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {aiUsageGuidelines.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="trade-hover-lift rounded-xl border border-brand-navy bg-gradient-to-br from-brand-navy to-blue-800 p-6 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider">Enterprise</span>
            <h2 className="mt-3 text-xl font-bold">セキュリティ要件・NDA・運用ルールも相談可能</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">
              導入前の稟議・情報システム部門確認・法務レビューに必要な説明を、段階的に整理できるようにします。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact?v=security" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-100">導入について相談する</Link>
              <Link href="/ai-room?v=security" className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">AI相談室で確認する</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
