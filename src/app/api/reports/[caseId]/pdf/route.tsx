import { renderToBuffer } from "@react-pdf/renderer";

import { getSessionEmail } from "@/lib/auth/server";
import { assertCaseOwner, getLatestConsultationByCaseId } from "@/lib/db/repository";
import { buildReportModel } from "@/lib/reports/build-report";
import { createRiskReportPdf } from "@/lib/reports/pdf";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/reports/[caseId]/pdf">,
) {
  const userEmail = await getSessionEmail();

  if (!userEmail) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { caseId } = await context.params;
  const detail = await assertCaseOwner(caseId, userEmail);

  if (!detail) {
    return new Response("Not found", { status: 404 });
  }

  const consultation = await getLatestConsultationByCaseId(caseId, userEmail);
  const model = buildReportModel(detail, consultation);

  if (!model) {
    return new Response("Report not ready", { status: 409 });
  }

  const pdfBuffer = await renderToBuffer(createRiskReportPdf(model));
  const pdfBytes = new Uint8Array(pdfBuffer);

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${caseId}.pdf"`,
    },
  });
}