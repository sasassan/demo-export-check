import type { RiskDimension } from "@/lib/constants";

export type InvestigationStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type CaseStatus =
  | "draft"
  | "investigating"
  | "completed"
  | "failed";

export type Grade = "A" | "B" | "C";

export type ProviderStatus = "success" | "partial" | "failed";

export type EvidenceItem = {
  id: string;
  dimension: RiskDimension;
  title: string;
  summary: string;
  sourceName: string;
  sourceType: "sanctions" | "company" | "news" | "country" | "ai";
  url?: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  capturedAt: string;
};

export type DimensionScore = {
  dimension: RiskDimension;
  label: string;
  score: number;
  grade: Grade;
  rationale: string;
  recommendedAction: string;
};

export type ScoreSummary = {
  overall: Grade;
  security: Grade;
  credit: Grade;
  logistics: Grade;
  country: Grade;
  headline: string;
  summary: string;
  nextActions: string[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type CaseRecord = {
  id: string;
  userEmail: string;
  productName: string;
  modelNumber: string;
  destinationCountry: string;
  customerCompanyName: string;
  productImageUrl?: string;
  status: CaseStatus;
  checklist: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
};

export type InvestigationRecord = {
  id: string;
  caseId: string;
  status: InvestigationStatus;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
};

export type AssessmentRecord = {
  caseId: string;
  summary: ScoreSummary;
  dimensions: DimensionScore[];
  evidence: EvidenceItem[];
  reportNarrative: string;
  createdAt: string;
  updatedAt: string;
};

export type CaseDetail = {
  case: CaseRecord;
  investigation?: InvestigationRecord;
  assessment?: AssessmentRecord;
};

export type CreateCaseInput = {
  productName: string;
  modelNumber: string;
  destinationCountry: string;
  customerCompanyName: string;
  productImageUrl?: string;
};

export type InvestigationFinding = {
  dimension: RiskDimension;
  label: string;
  baseScore: number;
  rationale: string;
  recommendedAction: string;
  evidence: EvidenceItem[];
};

export type ProviderResult = {
  providerName: string;
  status: ProviderStatus;
  findings: InvestigationFinding[];
  errors: string[];
};