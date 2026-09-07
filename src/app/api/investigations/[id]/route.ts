import { NextResponse } from "next/server";

import { getSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner } from "@/lib/db/repository";
import { withDbErrorHandling } from "@/lib/db/errors";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/investigations/[id]">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return withDbErrorHandling(async () => {
    const { id } = await context.params;
    const detail = await assertCaseOwner(id, userEmail);

    if (!detail) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(detail.investigation ?? null);
  });
}
