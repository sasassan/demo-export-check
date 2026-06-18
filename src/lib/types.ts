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

export type AiModel = "gpt-4o" | "claude" | "gemini" | "mock";

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
  aiModel?: AiModel;
};

export type DimensionScore = {
  dimension: RiskDimension;
  label: string;
  score: number;
  grade: Grade;
  rationale: string;
  recommendedAction: string;
  aiModel?: AiModel;
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

export type ImprovementStep = {
  action: string;
  scoreGain: number;
  cumulativeScore: number;
  priority: number;
  detail: string;
};

export type WorstCaseScenario = {
  scenario: string;
  impact: string;
  probability: "低" | "中" | "高";
  grade: Grade;
};

export type ReviewMeetingEntry = {
  model: AiModel;
  modelLabel: string;
  reviewComment: string;
  keyRisk: string;
  overallGrade: Grade;
};

export type ModelResult = {
  model: AiModel;
  modelLabel: string;
  dimensions: DimensionScore[];
  reviewComment?: string;
  keyRisk?: string;
};

export type AssessmentRecord = {
  caseId: string;
  summary: ScoreSummary;
  dimensions: DimensionScore[];
  evidence: EvidenceItem[];
  reportNarrative: string;
  modelResults?: ModelResult[];
  agreementRate?: number;
  reviewMeeting?: ReviewMeetingEntry[];
  improvementSteps?: ImprovementStep[];
  worstCaseScenarios?: WorstCaseScenario[];
  disagreementDimensions?: string[];
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
  aiModel?: AiModel;
};

export type ProviderResult = {
  providerName: string;
  status: ProviderStatus;
  findings: InvestigationFinding[];
  errors: string[];
  reviewComment?: string;
  keyRisk?: string;
  rawImprovementSteps?: Array<{ action: string; scoreGain: number; priority: number; detail: string }>;
  rawWorstCaseScenarios?: Array<{ scenario: string; impact: string; probability: "低" | "中" | "高"; grade: Grade }>;
};