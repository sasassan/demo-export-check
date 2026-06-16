import { createId } from "@/lib/utils";
import type { CaseRecord, ChecklistItem, DimensionScore, EvidenceItem } from "@/lib/types";

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

export function buildChecklistFromCase(caseRecord: {
  destinationCountry: string;
  customerCompanyName: string;
}): ChecklistItem[] {
  return [
    {
      id: createId("check"),
      label: "顧客企業の正式英字表記を確認する",
      completed: false,
    },
    {
      id: createId("check"),
      label: "最終需要先と用途確認書を回収する",
      completed: false,
    },
    {
      id: createId("check"),
      label: `${caseRecord.destinationCountry} 向けの規制・制裁状況を再確認する`,
      completed: false,
    },
    {
      id: createId("check"),
      label: `${caseRecord.customerCompanyName} の実在性資料を確認する`,
      completed: false,
    },
  ];
}

export function buildChecklistFromAssessment(input: {
  caseRecord: CaseRecord;
  dimensions: DimensionScore[];
  evidence: EvidenceItem[];
  nextActions: string[];
}): ChecklistItem[] {
  const actionItems = input.nextActions.map((action) => action.replace(/してください。?$/, "する"));
  const dimensionItems = input.dimensions
    .filter((item) => item.grade !== "A")
    .map((item) => `${item.label} の追加確認を実施する`);
  const evidenceItems = input.evidence
    .filter((item) => item.riskLevel !== "low")
    .slice(0, 2)
    .map((item) => `${item.title} の根拠ソースを確認する`);

  return uniqueItems([
    ...actionItems,
    ...dimensionItems,
    ...evidenceItems,
    `案件「${input.caseRecord.productName}」の社内共有用メモを整理する`,
  ]).map((label) => ({
    id: createId("check"),
    label,
    completed: false,
  }));
}