import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";
import { MonitoringDashboard } from "@/components/admin/monitoring-dashboard";
import { NOINDEX_METADATA } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = NOINDEX_METADATA;

export default async function AdminMonitoringPage() {
  await requireAdminEmail();

  return (
    <Shell
      title="管理者モニタリング"
      description="本番サービスの案件統計、AI利用状況、ユーザーアクティビティ、システムヘルス、エラー監視をリアルタイムに確認できます。"
    >
      <MonitoringDashboard />
    </Shell>
  );
}
