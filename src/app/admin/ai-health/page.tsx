import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";
import { AiHealthPanel } from "@/components/admin/ai-health-panel";
import { ConfigPreflightPanel } from "@/components/admin/config-preflight-panel";

export const dynamic = "force-dynamic";

export default async function AdminAiHealthPage() {
  const adminEmail = await requireAdminEmail();

  return (
    <Shell
      title="AIヘルス確認"
      description="各AIプロバイダーへの疎通状況、実モデル名、モデル廃止検知、本番投入前の設定プリフライトを管理者が確認できる診断画面です。"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">管理者確認</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          現在の管理者セッション: {adminEmail}
        </p>
      </section>

      <AiHealthPanel />
      <ConfigPreflightPanel />
    </Shell>
  );
}
