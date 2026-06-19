import { notFound } from "next/navigation";

import { AiRoomPanel } from "@/components/ai/ai-room-panel";
import { Shell } from "@/components/layout/shell";
import { requireSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";

export default async function CaseChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userEmail = await requireSessionEmail();
  const { id } = await params;
  const detail = await assertCaseOwner(id, userEmail);

  if (!detail) {
    notFound();
  }

  const contextText = [
    `案件名: ${detail.case.productName}`,
    `型番: ${detail.case.modelNumber}`,
    `輸出先国: ${detail.case.destinationCountry}`,
    `顧客企業名: ${detail.case.customerCompanyName}`,
    detail.assessment?.summary.summary ? `AIサマリー: ${detail.assessment.summary.summary}` : "",
    detail.assessment?.summary.nextActions?.length
      ? `推奨アクション: ${detail.assessment.summary.nextActions.join(" / ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Shell
      title={`案件AI相談: ${detail.case.productName}`}
      description="案件情報と診断結果を踏まえて、この案件専用に追加相談できます。"
    >
      <AiRoomPanel
        initialMode="general"
        initialMessage={`この案件について追加で確認したいです。`}
        initialSourceText={contextText}
        caseContext={{
          caseId: detail.case.id,
          productName: detail.case.productName,
          destinationCountry: detail.case.destinationCountry,
          customerCompanyName: detail.case.customerCompanyName,
        }}
      />
    </Shell>
  );
}