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
  /** 論理削除された時刻。未削除の場合はundefined。 */
  deletedAt?: string;
};

export type DeletedCaseRecord = CaseRecord & { deletedAt: string };

export type AuditLogAction = "case.delete" | "case.restore";

export type AuditLogRecord = {
  id: string;
  actorEmail: string;
  action: AuditLogAction;
  targetId: string;
  createdAt: string;
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
  /** 実際にAPIが呼び出したモデル名（例: "gpt-4o-mini"）。APIレスポンスから取得した実測値。 */
  actualModelName?: string;
  reviewComment: string;
  keyRisk: string;
  overallGrade: Grade;
};

export type ModelResult = {
  model: AiModel;
  modelLabel: string;
  /** 実際にAPIが呼び出したモデル名（例: "gpt-4o-mini"）。APIレスポンスから取得した実測値。 */
  actualModelName?: string;
  dimensions: DimensionScore[];
  reviewComment?: string;
  keyRisk?: string;
  providerStatus?: "live" | "fallback-no-key" | "fallback-disabled" | "fallback-error";
  providerStatusLabel?: string;
  providerReason?: string;
};

export type CrossReviewVote = {
  model: AiModel;
  modelLabel: string;
  score: number;
  grade: Grade;
};

export type CrossReviewDimension = {
  dimension: RiskDimension;
  label: string;
  votes: CrossReviewVote[];
  consensusScore: number;
  consensusGrade: Grade;
  method: "single" | "unanimous" | "majority" | "tie-break";
  hasDisagreement: boolean;
};

export type CrossReviewSummary = {
  dimensions: CrossReviewDimension[];
  overallConsensusGrade: Grade;
  confidenceLevel: "高" | "中" | "低";
  confidenceScore: number;
  participatingProviders: AiModel[];
  skippedProviders: AiModel[];
  isフォールバックOnly: boolean;
};

/** 統合評価レポートにおける個別AIの見解（両論併記用） */
export type IntegratedEvaluationOpinion = {
  model: AiModel;
  modelLabel: string;
  grade: Grade;
  score: number;
  rationale: string;
};

/** 次元ごとの統合評価結果。isAgreement=trueは全AI一致（確信度高）、falseは評価が割れた項目 */
export type IntegratedEvaluationPoint = {
  dimension: RiskDimension;
  label: string;
  isAgreement: boolean;
  confidence: "高" | "中" | "低";
  consensusGrade: Grade;
  consensusScore: number;
  opinions: IntegratedEvaluationOpinion[];
};

/** 「3つのAIによる統合評価」レポートの集約結果 */
export type IntegratedEvaluationSummary = {
  title: string;
  participatingProviders: AiModel[];
  agreementPoints: IntegratedEvaluationPoint[];
  disagreementPoints: IntegratedEvaluationPoint[];
  overallConsensusGrade: Grade;
  confidenceLevel: "高" | "中" | "低";
  confidenceScore: number;
  isフォールバックOnly: boolean;
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
  crossReview?: CrossReviewSummary;
  integratedEvaluation?: IntegratedEvaluationSummary;
  regulationUpdates?: Array<{
    title: string;
    summary: string;
    impact: string;
    sourceName: string;
    href?: string;
    publishedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
};


export type AiConsultationRecord = {
  caseDraft?: Partial<CreateCaseInput>;
  confidenceLabel?: "高" | "中" | "低";
  documentSummary?: string;
  factHighlights?: string[];
  fetchedUrlText?: string;
  followUpQuestions?: string[];
  keywordHighlights?: string[];
  relatedClauses?: string[];
  assumptionHighlights?: string[];
  citations?: Array<{
    label: string;
    snippet: string;
    sourceType: "sourceText" | "urlFetched" | "dictionary" | "model";
  }>;
  feedback?: "helpful" | "needs-work";
  feedbackComment?: string;
  sourceFetchStatus?: "success" | "failed" | "not_requested";
  caseId?: string;
  id: string;
  userEmail: string;
  mode: string;
  question: string;
  sourceUrl?: string;
  sourceText?: string;
  answerTitle: string;
  answer: string;
  judgement?: string;
  recommendedChecks?: string[];
  createdAt: string;
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
  providerStatus?: "live" | "fallback-no-key" | "fallback-disabled" | "fallback-error";
  providerStatusLabel?: string;
  providerReason?: string;
  /**
   * 実際にAPIが呼び出したモデル名（例: "gpt-4o-mini-2024-07-18"）。
   * 設定上の想定モデル名（runtime.modelName）ではなく、APIレスポンスに
   * 含まれる実測値を使う。表示ラベル（"GPT-4o"等）が固定文言のため、
   * 実際に使われた廉価モデルと誤認させないための補足情報として利用する。
   */
  actualModelName?: string;
};

export type AnalyticsDeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export type AnalyticsSessionRecord = {
  id: string;
  visitorId: string;
  userEmail?: string;
  entryPath: string;
  exitPath?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  deviceType: AnalyticsDeviceType;
  startedAt: string;
  lastSeenAt: string;
};

export type AnalyticsEventRecord = {
  id: string;
  sessionId: string;
  visitorId: string;
  userEmail?: string;
  eventName: string;
  path: string;
  fromPath?: string;
  toPath?: string;
  label?: string;
  meta?: Record<string, unknown>;
  /** 滞在時間（ミリ秒）。eventName === "time_spent" のイベントでページ離脱時に記録される。 */
  durationMs?: number;
  createdAt: string;
};

export type AnalyticsCollectInput = {
  session: AnalyticsSessionRecord;
  event: AnalyticsEventRecord;
};