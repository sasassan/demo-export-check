import { z } from "zod";
import { EvidenceSchema } from "./evidence";

export const FindingSchema = z.object({
  code: z.string().min(1).max(80),
  severity: z.enum(["info", "review", "critical"]),
  explanation: z.string().min(1).max(3000),
  evidenceIds: z.array(z.string()).default([]),
});
export const AssessmentInputSchema = z.object({
  subjectId: z.string().min(1).max(128),
  checkedAt: z.iso.datetime({ offset: true }),
  evidence: z.array(EvidenceSchema).max(200),
  findings: z.array(FindingSchema).max(200),
  requiredChecks: z.array(z.string().min(1)).max(100),
  completedChecks: z.array(z.string().min(1)).max(100),
});
export type AssessmentInput = z.infer<typeof AssessmentInputSchema>;

/** Conservative workflow triage; never an export authorization. */
export function triageAssessment(raw: unknown) {
  const input = AssessmentInputSchema.parse(raw);
  const evidenceIds = new Set(input.evidence.map((item) => item.id));
  const missingChecks = [...new Set(input.requiredChecks)].filter(
    (check) => !input.completedChecks.includes(check),
  );
  const unsupportedFindings = input.findings
    .filter((finding) => finding.evidenceIds.length === 0 ||
      finding.evidenceIds.some((id) => !evidenceIds.has(id)))
    .map((finding) => finding.code);
  const critical = input.findings.some((finding) => finding.severity === "critical");
  const review = input.findings.some((finding) => finding.severity === "review");
  const grade = critical ? "C" : review || missingChecks.length || unsupportedFindings.length ? "B" : "A";
  return {
    grade,
    subjectId: input.subjectId,
    checkedAt: input.checkedAt,
    missingChecks,
    unsupportedFindings,
    findingCount: input.findings.length,
    authorization: false as const,
    message: "参考情報です。輸出の許可・適法性を保証しません。担当者による確認が必要です。",
  };
}
