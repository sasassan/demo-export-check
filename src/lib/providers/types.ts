import type { CaseRecord, ProviderResult } from "@/lib/types";

export interface InvestigationProvider {
  run(caseRecord: CaseRecord): Promise<ProviderResult>;
}