import Link from "next/link";

import {
  ClipboardPenIcon,
  CompassRoseIcon,
  LighthouseIcon,
  MagnifierDocumentIcon,
  RegulationDocIcon,
  SatelliteIcon,
} from "@/components/icons/trade-icons";
import { Shell } from "@/components/layout/shell";
import { getSessionEmail } from "@/lib/auth/server";
import { listCasesByUser } from "@/lib/db/repository";
import { buildSeo } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = buildSeo({
  title: "メインページ",
  description:
    "ダッシュボード・AI相談室・用語辞典・学習コンテンツへの入り口です。今日のやることと最近の案件をまとめて確認できます。",
  path: "/main",
});

const statusConfig = {
  draft: { label: "下書き", cls: "bg-slate-100 text-slate-600" },
  investigating: { label: "AI確認中", cls: "bg-tint-blue text-blue-300" },
  completed: { label: "調査完了", cls: "bg-tint-emerald text-emerald-400" },
  failed: { label: "エラー", cls: "bg-tint-rose text-rose-400" },
} as const;

const navCards = [
  {
    href: "/dashboard",
    title: "ダッシュボード",
    desc: "案件の進捗・検索・絞り込み、削除済み案件の管理をまとめて確認できます。",
    icon: SatelliteIcon,
    tint: "bg-tint-blue text-brand-navy",
  },
  {
    href: "/cases/new",
    title: "案件を登録",
    desc: "商品・輸出先・相手先を入力して、AI一次スクリーニングを開始します。",
    icon: ClipboardPenIcon,
    tint: "bg-tint-teal text-brand-teal",
  },
  {
    href: "/ai-room",
    title: "AI相談室",
    desc: "条文・規制資料・社内規程の読解を、AIに相談しながら進められます。",
    icon: LighthouseIcon,
    tint: "bg-tint-violet text-violet-400",
  },
  {
    href: "/glossary",
    title: "輸出用語辞典",
    desc: "該非判定・キャッチオール規制など、専門用語を検索・確認できます。",
    icon: MagnifierDocumentIcon,
    tint: "bg-tint-sky text-sky-400",
  },
  {
    href: "/learning",
    title: "学習コンテンツ",
    desc: "失敗例・注意点・研修資料で、輸出管理の基礎を学べます。",
    icon: CompassRoseIcon,
    tint: "bg-tint-amber text-amber-400",
  },
  {
    href: "/updates",
    title: "規制アップデート",
    desc: "制裁・品目規制・手続きの最新動向と確認ポイントを確認できます。",
    icon: RegulationDocIcon,
    tint: "bg-tint-emerald text-brand-emerald",
  },
];

const routineTasks = [
  {
    label: "規制アップデートをチェック",
    desc: "制裁・品目規制・手続きの最新動向を確認します。",
    href: "/updates",
  },
  {
    label: "AI相談室で条文を相談",
    desc: "分からない条文や社内規程の読解をAIに相談できます。",
    href: "/ai-room",
  },
  {
    label: "用語を復習する",
    desc: "該非判定・キャッチオール規制の用語を辞典で確認します。",
    href: "/glossary",
  },
];

export default async function MainPage() {
  const userEmail = await getSessionEmail();
  const items = userEmail ? await listCasesByUser(userEmail) : [];
  const recent = items.slice(0, 3);
  const investigating = items.filter((item) => item.status === "investigating").length;
  const completed = items.filter((item) => item.status === "completed").length;

  const topTask =
    items.length === 0
      ? {
          label: "最初の案件を登録する",
          desc: "商品・輸出先・相手先を入力して、AI一次スクリーニングを始められます。",
          href: "/cases/new",
        }
      : investigating > 0
        ? {
            label: "スクリーニング中の案件を確認",
            desc: `${investigating}件の案件をAIが確認中です。進捗をチェックしましょう。`,
            href: "/dashboard",
          }
        : {
            label: "結果確認待ちの案件を見る",
            desc: `${completed}件の調査結果を確認できます。A/B/C評価と根拠を確認しましょう。`,
            href: "/dashboard",
          };

  const todayTasks = [topTask, ...routineTasks];

  return (
    <Shell
      title="メインページ"
      description="ダッシュボード・AI相談室・用語辞典・学習コンテンツへの入り口です。今日のやることと最近の案件をまとめて確認できます。"
    >
      {userEmail ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-panel px-6 py-4 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tint-blue text-sm font-semibold text-brand-navy">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{userEmail}</p>
              <p className="text-sm text-slate-500">
                {items.length} 件の案件 · 完了 {completed} 件
                {investigating > 0 ? ` · AI確認中 ${investigating} 件` : ""}
              </p>
            </div>
          </div>
          <Link
            href="/cases/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-deep px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-deep-light hover:shadow-md sm:w-auto sm:py-2.5"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            新規案件を登録
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-brand-navy bg-gradient-to-br from-brand-deep to-blue-800 px-6 py-5 text-white shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold">
              ログインすると案件の進捗と最近の案件がここに表示されます
            </p>
            <p className="mt-1 text-sm text-blue-100/90">
              メールアドレスだけで開始できます。登録後すぐに案件登録からAI診断まで試せます。
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-panel px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              ログイン
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              デモを見る
            </Link>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-900">主要機能</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {navCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="trade-hover-lift group flex items-start gap-3 rounded-xl border border-slate-200 bg-panel p-5 shadow-sm"
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.tint}`}>
                <card.icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-900 transition group-hover:text-brand-navy">
                  {card.title}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">{card.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">今日のやること</h2>
          <div className="mt-4 space-y-3">
            {todayTasks.map((task, index) => (
              <Link
                key={task.label}
                href={task.href}
                className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition hover:border-brand-navy/40 ${
                  index === 0
                    ? "border-brand-navy bg-gradient-to-r from-tint-blue/70 to-panel"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    index === 0 ? "bg-brand-deep" : "bg-slate-300"
                  }`}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{task.label}</span>
                  <span className="mt-0.5 block text-sm leading-6 text-slate-500">{task.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">最近の案件</h2>
            {userEmail && items.length > 0 ? (
              <Link href="/dashboard" className="text-sm font-semibold text-brand-navy hover:underline">
                すべて見る
              </Link>
            ) : null}
          </div>
          {!userEmail ? (
            <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-slate-300 px-6 py-8 text-center">
              <p className="text-sm text-slate-500">
                ログインすると、最近の案件とAI診断の進捗がここに表示されます。
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-deep px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-deep-light"
              >
                ログインして始める
              </Link>
            </div>
          ) : recent.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-lg border border-dashed border-slate-300 px-6 py-8 text-center">
              <p className="text-sm text-slate-500">案件がまだありません。最初の案件を登録してみましょう。</p>
              <Link
                href="/cases/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-deep px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-brand-deep-light"
              >
                最初の案件を登録する
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {recent.map((item) => {
                const status = statusConfig[item.status];
                return (
                  <Link
                    key={item.id}
                    href={`/cases/${item.id}`}
                    className="trade-hover-lift flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {item.productName}
                        {item.modelNumber ? ` (${item.modelNumber})` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.destinationCountry} · {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                      {status.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
