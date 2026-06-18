import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { createCaseRecord, listAiConsultationsByUser, markConsultationAsCased } from "@/lib/db/repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const consultations = await listAiConsultationsByUser(userEmail);
  const target = consultations.find((item) => item.id === id);

  if (
    !target ||
    !target.caseDraft?.productName ||
    !target.caseDraft?.modelNumber ||
    !target.caseDraft?.destinationCountry ||
    !target.caseDraft?.customerCompanyName
  ) {
    return NextResponse.json({ error: "案件化に必要な情報が不足しています。" }, { status: 400 });
  }

  const record = await createCaseRecord(userEmail, {
    productName: target.caseDraft.productName,
    modelNumber: target.caseDraft.modelNumber,
    destinationCountry: target.caseDraft.destinationCountry,
    customerCompanyName: target.caseDraft.customerCompanyName,
  });

  await markConsultationAsCased(id, record.id);

  return NextResponse.json({ id: record.id });
}
