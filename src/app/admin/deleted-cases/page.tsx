import { DeletedCasesPanel } from "@/components/cases/deleted-cases-panel.lazy";
import { Shell } from "@/components/layout/shell";
import { requireAdminEmail } from "@/lib/auth/server";
import { listAllDeletedCases } from "@/lib/db/repository";
import { NOINDEX_METADATA } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = NOINDEX_METADATA;

export default async function AdminDeletedCasesPage() {
  const adminEmail = await requireAdminEmail();
  const deletedItems = await listAllDeletedCases();

  return (
    <Shell
      title="削除済み案件の管理"
      description="全ユーザーの削除済み案件を確認し、猶予期間（30日）内であれば管理者として復元できます。"
    >
      <section className="rounded-xl border border-slate-200 bg-panel p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">管理者確認</p>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          現在の管理者セッション: {adminEmail}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {deletedItems.length}件の削除済み案件があります。
        </p>
      </section>

      <DeletedCasesPanel items={deletedItems} showOwner />
    </Shell>
  );
}
