import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";
import { getMonthlyAnalytics, type AnalyticsDailyPoint } from "@/lib/db/repository";
import { EmptyState } from "@/components/ui/empty-state";
import { NOINDEX_METADATA } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = NOINDEX_METADATA;

const DEVICE_LABELS: Record<string, string> = {
  desktop: "デスクトップ",
  mobile: "モバイル",
  tablet: "タブレット",
  unknown: "不明",
};

const CHART_HEIGHT = 160;

function getCurrentMonthInJst(): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return { year, month };
}

function formatNumber(value: number): string {
  return value.toLocaleString("ja-JP");
}

function formatStayTime(ms: number): string {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}秒`;
  const minutes = Math.floor(totalSeconds / 60);
  const rest = totalSeconds % 60;
  return rest > 0 ? `${minutes}分${rest}秒` : `${minutes}分`;
}

function SummaryCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="trade-hover-lift rounded-xl border border-slate-200 bg-panel p-5 shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
      {subtext ? <p className="mt-1 text-xs text-slate-400">{subtext}</p> : null}
    </div>
  );
}

function DailyTrendChart({ daily }: { daily: AnalyticsDailyPoint[] }) {
  const maxPv = daily.reduce((acc, point) => Math.max(acc, point.pageViews), 0);
  const maxVisitors = daily.reduce((acc, point) => Math.max(acc, point.uniqueVisitors), 0);

  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-cyan/80" />
        ページビュー
        <span className="ml-3 inline-block h-2.5 w-2.5 rounded-sm bg-brand-teal/70" />
        ユニーク訪問者
      </div>

      <div className="mt-4 flex items-end gap-[3px]" style={{ height: CHART_HEIGHT }}>
        {daily.map((point) => {
          const pvHeight = maxPv > 0 ? Math.round((point.pageViews / maxPv) * CHART_HEIGHT) : 0;
          const visitorHeight =
            maxVisitors > 0 ? Math.round((point.uniqueVisitors / maxVisitors) * CHART_HEIGHT) : 0;
          const dayLabel = `${point.date}：PV ${point.pageViews} / UU ${point.uniqueVisitors}`;
          return (
            <div
              key={point.date}
              className="flex flex-1 flex-col items-center justify-end gap-[2px]"
              title={dayLabel}
              aria-label={dayLabel}
            >
              <div
                className="w-full max-w-[16px] rounded-t bg-brand-cyan/80 transition hover:bg-brand-cyan"
                style={{ height: Math.max(pvHeight, point.pageViews > 0 ? 4 : 0) }}
              />
              <div
                className="w-full max-w-[16px] rounded-t bg-brand-teal/70 transition hover:bg-brand-teal"
                style={{ height: Math.max(visitorHeight, point.uniqueVisitors > 0 ? 4 : 0) }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-[3px] border-t border-slate-100 pt-2">
        {daily.map((point) => {
          const day = Number(point.date.slice(-2));
          const showLabel = day === 1 || day % 5 === 0;
          return (
            <div key={point.date} className="flex-1 text-center text-[9px] text-slate-400">
              {showLabel ? day : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const adminEmail = await requireAdminEmail("/admin/analytics");
  const { year, month } = getCurrentMonthInJst();
  const data = await getMonthlyAnalytics(year, month);

  const hasAnyData = data.totalPageViews > 0 || data.totalSessions > 0 || data.totalCtaClicks > 0;

  return (
    <Shell
      title="アクセス分析"
      description={`${data.periodLabel}の管理者向けアクセス解析です。アクセス人数（ユニークビジター）、滞在時間、閲覧ページ別PV数を確認できます。`}
    >
      <section className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-panel p-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-900">集計期間: {data.periodLabel}</p>
          <p className="mt-1 text-xs leading-6 text-slate-500">
            日本時間（JST）基準で月初から月末までを集計しています。
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-500">管理者セッション</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{adminEmail}</p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          label="アクセス人数（ユニークビジター）"
          value={formatNumber(data.uniqueVisitors)}
          subtext="今月にページを閲覧したユニークな訪問者"
        />
        <SummaryCard
          label="平均滞在時間"
          value={formatStayTime(data.avgStayMsOverall)}
          subtext="1ページあたりの平均滞在時間"
        />
        <SummaryCard label="総ページビュー" value={formatNumber(data.totalPageViews)} />
        <SummaryCard label="セッション数" value={formatNumber(data.totalSessions)} />
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">日別推移</p>
            <p className="mt-1 text-xs text-slate-500">1日ごとのページビューとユニーク訪問者数の推移です。</p>
          </div>
          <p className="text-xs font-semibold text-slate-400">{data.periodLabel}</p>
        </div>
        {!hasAnyData ? (
          <div className="mt-4">
            <EmptyState
              title="まだデータがありません"
              description="アクセスが蓄積すると、ここに日別の推移が表示されます。"
            />
          </div>
        ) : (
          <div className="mt-5">
            <DailyTrendChart daily={data.daily} />
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">ページ別PVランキング・平均滞在時間</p>
          <p className="mt-1 text-xs text-slate-500">閲覧ページ別のPV数と1ページあたりの平均滞在時間です。</p>
          {data.topPaths.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="まだデータがありません"
                description="アクセスが蓄積すると、ここにページ別の集計が表示されます。"
              />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-2 font-semibold">ページ</th>
                    <th className="py-2 px-2 text-right font-semibold">PV</th>
                    <th className="py-2 pl-2 text-right font-semibold">平均滞在時間</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPaths.slice(0, 20).map((item) => (
                    <tr key={item.path} className="border-b border-slate-100">
                      <td className="max-w-[220px] truncate py-2 pr-2 text-slate-700">{item.path}</td>
                      <td className="py-2 px-2 text-right font-semibold text-slate-900">
                        {formatNumber(item.pageViews)}
                      </td>
                      <td className="py-2 pl-2 text-right text-slate-600">
                        {formatStayTime(item.avgStayMs)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">デバイス内訳</p>
          <p className="mt-1 text-xs text-slate-500">セッション開始時のデバイス種別です。</p>
          {data.deviceBreakdown.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="まだデータがありません"
                description="アクセスが蓄積すると、ここにデバイス内訳が表示されます。"
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.deviceBreakdown.map((item) => (
                <li
                  key={item.deviceType}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"
                >
                  <span className="text-slate-700">
                    {DEVICE_LABELS[item.deviceType] ?? item.deviceType}
                  </span>
                  <span className="font-semibold text-slate-900">{formatNumber(item.count)}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-sm font-semibold text-slate-900">CTAクリック（上位）</p>
          {data.topCtas.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="まだデータがありません"
                description="CTAクリックが蓄積すると、ここに表示されます。"
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.topCtas.map((item) => (
                <li
                  key={item.ctaId}
                  className="flex items-center justify-between border-b border-slate-100 pb-2 text-sm"
                >
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">{formatNumber(item.count)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </Shell>
  );
}
