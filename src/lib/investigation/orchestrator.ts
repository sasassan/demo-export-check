import { buildChecklistFromAssessment } from "@/lib/checklist/generator";
import { mergeChecklistItems } from "@/lib/checklist/merge";
import { generateNarrative } from "@/lib/providers/openai";
import { summarizeExternalSignals } from "@/lib/providers/gemini";
import { MockCompanyProvider } from "@/lib/providers/mock/company";
import { MockCountryProvider } from "@/lib/providers/mock/country";
import { MockNewsProvider } from "@/lib/providers/mock/news";
import { MockSanctionsProvider } from "@/lib/providers/mock/sanctions";
import {
  assertCaseOwner,
  getCaseDetail,
  replaceCaseChecklist,
  saveAssessment,
  updateInvestigationStatus,
} from "@/lib/db/repository";
import { collectEvidence, flattenFindings } from "@/lib/investigation/normalizers";
import { buildDimensionScores, buildScoreSummary } from "@/lib/risk/scoring";
import type { AssessmentRecord } from "@/lib/types";

const providers = [
  new MockSanctionsProvider(),
  new MockCompanyProvider(),
  new MockNewsProvider(),
  new MockCountryProvider(),
];

export async function runInvestigation(caseId: string, userEmail: string) {
  const detail = await assertCaseOwner(caseId, userEmail);

  if (!detail) {
    return null;
  }

  await updateInvestigationStatus(caseId, {
    status: "running",
    startedAt: new Date().toISOString(),
  });

  try {
    const results = await Promise.all(providers.map((provider) => provider.run(detail.case)));
    const findings = flattenFindings(results);
    const dimensions = buildDimensionScores(findings);
    const summary = buildScoreSummary(dimensions);
    const evidence = collectEvidence(results);
    const highlights = await summarizeExternalSignals(
      dimensions.filter((item) => item.grade !== "A").map((item) => item.label),
    );
    const reportNarrative = await generateNarrative({
      productName: detail.case.productName,
      destinationCountry: detail.case.destinationCountry,
      customerCompanyName: detail.case.customerCompanyName,
      overallGrade: summary.overall,
      highlights: highlights ? highlights.split(" / ") : ["追加確認事項"],
    });
    const now = new Date().toISOString();

    const assessment: AssessmentRecord = {
      caseId,
      summary,
      dimensions,
      evidence,
      reportNarrative,
      createdAt: detail.assessment?.createdAt ?? now,
      updatedAt: now,
    };

    await saveAssessment(assessment);
    const generatedChecklist = buildChecklistFromAssessment({
      caseRecord: detail.case,
      dimensions,
      evidence,
      nextActions: summary.nextActions,
    });
    await replaceCaseChecklist(
      caseId,
      mergeChecklistItems(detail.case.checklist, generatedChecklist),
    );
    await updateInvestigationStatus(caseId, {
      status: "completed",
      completedAt: now,
    });

    return getCaseDetail(caseId);
  } catch (error) {
    await updateInvestigationStatus(caseId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "調査中に予期しないエラーが発生しました。",
    });
    return getCaseDetail(caseId);
  }
}