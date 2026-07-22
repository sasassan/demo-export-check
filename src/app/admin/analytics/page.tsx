import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";
import { getAnalyticsSummary } from "@/lib/db/repository";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

const DEVICE_LABELS: Record<string, string> = {
  desktop: "デスクトップ",
  mobile: "モバイル",
  tablet: "タブレット",
  unknown: "不明",
};

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="trade-hover-lift rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const adminEmail = await requireAdminEmail();
  const summary = await getAnalyticsSummary(30);

  return (
    <Shell
      title="アクセス分析"
      description="管理者向けのアクセス分析画面です。訪問数、導線、CTAクリックなどを確認できます（直近30日間）。"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">管理者確認</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          現在の管理者セッション: {adminEmail}
        </p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="セッション数" value={summary.totalSessions} />
        <SummaryCard label="ユニーク訪問者数" value={summary.uniqueVisitors} />
        <SummaryCard label="ページビュー数" value={summary.totalPageViews} />
        <SummaryCard label="CTAクリック数" value={summary.totalCtaClicks} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">ページ別ビュー数（上位10件）</p>
          {summary.topPaths.length === 0 ? (
            <EmptyState title="まだデータがありません" description="アクセスが蓄積すると、ここに集計結果が表示されます。" />
          ) : (
            <ul className="mt-4 space-y-2">
              {summary.topPaths.map((item) => (
                <li
                  key={item.path}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm"
                >
                  <span className="text-slate-700">{item.path}</span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">CTAクリック（上位10件）</p>
          {summary.topCtas.length === 0 ? (
            <EmptyState title="まだデータがありません" description="アクセスが蓄積すると、ここに集計結果が表示されます。" />
          ) : (
            <ul className="mt-4 space-y-2">
              {summary.topCtas.map((item) => (
                <li
                  key={item.ctaId}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm"
                >
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <p className="text-sm font-semibold text-slate-900">デバイス内訳</p>
          {summary.deviceBreakdown.length === 0 ? (
            <EmptyState title="まだデータがありません" description="アクセスが蓄積すると、ここに集計結果が表示されます。" />
          ) : (
            <ul className="mt-4 flex flex-wrap gap-4">
              {summary.deviceBreakdown.map((item) => (
                <li
                  key={item.deviceType}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  <span className="text-slate-700">
                    {DEVICE_LABELS[item.deviceType] ?? item.deviceType}
                  </span>
                  <span className="ml-2 font-semibold text-slate-900">{item.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Shell>
  );
}