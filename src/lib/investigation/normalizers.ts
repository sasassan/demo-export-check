import type { EvidenceItem, ProviderResult } from "@/lib/types";

export function collectEvidence(results: ProviderResult[]): EvidenceItem[] {
  return results.flatMap((result) =>
    result.findings.flatMap((finding) => finding.evidence),
  );
}

export function flattenFindings(results: ProviderResult[]) {
  return results.flatMap((result) => result.findings);
}