import { CaseForm } from "@/components/forms/case-form";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";

export const dynamic = "force-static";

export default async function NewCasePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireSessionEmail();
  const params = await searchParams;

  const readValue = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const initialValues = {
    productName: readValue("productName") ?? "",
    modelNumber: readValue("modelNumber") ?? "",
    destinationCountry: readValue("destinationCountry") ?? "",
    customerCompanyName: readValue("customerCompanyName") ?? "",
  };

  return (
    <Shell
      title="新規案件登録"
      description="商品情報と顧客情報を入力すると、制裁・企業・用途・国リスクの一次スクリーニングを支援します。"
    >
      <CaseForm initialValues={initialValues} />
    </Shell>
  );
}