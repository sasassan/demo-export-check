import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";

export const dynamic = "force-static";

export default async function AdminAnalyticsPage() {
  const adminEmail = await requireAdminEmail();

  return (
    <Shell
      title="アクセス分析"
      description="管理者向けのアクセス分析画面です。訪問数、導線、CTAクリックなどを今後ここで確認できるようにします。"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">管理者確認</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          現在の管理者セッション: {adminEmail}
        </p>
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
          分析テーブルと管理者認可の土台は実装済みです。次の段階で、訪問イベント収集APIと集計カードを追加します。
        </div>
      </section>
    </Shell>
  );
}