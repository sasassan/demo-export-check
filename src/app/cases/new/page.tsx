import { CaseForm } from "@/components/forms/case-form";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";

export default async function NewCasePage() {
  await requireSessionEmail();

  return (
    <Shell
      title="新規案件登録"
      description="商品情報と顧客情報を入力すると、制裁・企業・用途・国リスクの一次スクリーニングを支援します。"
    >
      <CaseForm />
    </Shell>
  );
}