import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { listAiConsultationsByUser } from "@/lib/db/repository";

export async function GET() {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    return NextResponse.json({ items: [] });
  }

  const items = await listAiConsultationsByUser(userEmail);
  return NextResponse.json({ items });
}
