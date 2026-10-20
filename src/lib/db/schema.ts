import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const analyticsSessions = pgTable(
  "analytics_sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    visitorId: varchar("visitor_id", { length: 128 }).notNull(),
    userEmail: varchar("user_email", { length: 255 }),
    entryPath: text("entry_path").notNull(),
    exitPath: text("exit_path"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    deviceType: varchar("device_type", { length: 32 }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("analytics_sessions_visitor_id_idx").on(table.visitorId),
    index("analytics_sessions_user_email_idx").on(table.userEmail),
    index("analytics_sessions_started_at_idx").on(table.startedAt),
  ],
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    visitorId: varchar("visitor_id", { length: 128 }).notNull(),
    userEmail: varchar("user_email", { length: 255 }),
    eventName: varchar("event_name", { length: 64 }).notNull(),
    path: text("path").notNull(),
    fromPath: text("from_path"),
    toPath: text("to_path"),
    label: text("label"),
    meta: jsonb("meta"),
    /**
     * 滞在時間（ミリ秒）。event_name = 'time_spent' のイベントで、
     * ページ離脱時にそのページに滞在していた時間を記録する。
     * それ以外のイベント（page_view / cta_click）では null のまま。
     */
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("analytics_events_session_id_idx").on(table.sessionId),
    index("analytics_events_event_name_idx").on(table.eventName),
    index("analytics_events_created_at_idx").on(table.createdAt),
  ],
);

export const cases = pgTable(
  "cases",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userEmail: varchar("user_email", { length: 255 }).notNull(),
    productName: text("product_name").notNull(),
    modelNumber: text("model_number").notNull(),
    destinationCountry: text("destination_country").notNull(),
    customerCompanyName: text("customer_company_name").notNull(),
    productImageUrl: text("product_image_url"),
    status: varchar("status", { length: 32 }).notNull(),
    checklist: jsonb("checklist").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    /**
     * 論理削除用タイムスタンプ。NULLの間は通常の一覧・詳細取得の対象となる。
     * 値が入ると「削除済み」とみなし、通常経路からは除外する
     * （猶予期間内の復元を可能にするため物理削除は行わない）。
     * docs/case-deletion-design.md 参照。
     */
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("cases_user_email_idx").on(table.userEmail),
    index("cases_deleted_at_idx").on(table.deletedAt),
  ],
);

export const investigations = pgTable(
  "investigations",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    caseId: varchar("case_id", { length: 64 }).notNull(),
    status: varchar("status", { length: 32 }).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("investigations_case_id_idx").on(table.caseId)],
);

export const riskAssessments = pgTable("risk_assessments", {
  caseId: varchar("case_id", { length: 64 }).primaryKey(),
  summary: jsonb("summary").notNull(),
  reportNarrative: text("report_narrative").notNull(),
  dimensions: jsonb("dimensions").notNull().default([]),
  evidence: jsonb("evidence").notNull().default([]),
  modelResults: jsonb("model_results"),
  agreementRate: integer("agreement_rate"),
  reviewMeeting: jsonb("review_meeting"),
  improvementSteps: jsonb("improvement_steps"),
  worstCaseScenarios: jsonb("worst_case_scenarios"),
  disagreementDimensions: jsonb("disagreement_dimensions"),
  crossReview: jsonb("cross_review"),
  integratedEvaluation: jsonb("integrated_evaluation"),
  regulationUpdates: jsonb("regulation_updates"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const aiConsultations = pgTable(
  "ai_consultations",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userEmail: varchar("user_email", { length: 255 }).notNull(),
    caseId: varchar("case_id", { length: 64 }),
    mode: varchar("mode", { length: 64 }).notNull(),
    question: text("question").notNull(),
    sourceUrl: text("source_url"),
    sourceText: text("source_text"),
    fetchedUrlText: text("fetched_url_text"),
    sourceFetchStatus: varchar("source_fetch_status", { length: 32 }),
    answerTitle: text("answer_title").notNull(),
    answer: text("answer").notNull(),
    confidenceLabel: varchar("confidence_label", { length: 16 }),
    documentSummary: text("document_summary"),
    judgement: text("judgement"),
    factHighlights: jsonb("fact_highlights"),
    assumptionHighlights: jsonb("assumption_highlights"),
    relatedClauses: jsonb("related_clauses"),
    keywordHighlights: jsonb("keyword_highlights"),
    followUpQuestions: jsonb("follow_up_questions"),
    citations: jsonb("citations"),
    recommendedChecks: jsonb("recommended_checks"),
    feedback: varchar("feedback", { length: 32 }),
    feedbackComment: text("feedback_comment"),
    caseDraft: jsonb("case_draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("ai_consultations_user_email_idx").on(table.userEmail),
    index("ai_consultations_case_id_idx").on(table.caseId),
  ],
);

export const riskDimensionScores = pgTable(
  "risk_dimension_scores",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    caseId: varchar("case_id", { length: 64 }).notNull(),
    dimension: varchar("dimension", { length: 32 }).notNull(),
    label: text("label").notNull(),
    score: integer("score").notNull(),
    grade: varchar("grade", { length: 8 }).notNull(),
    rationale: text("rationale").notNull(),
    recommendedAction: text("recommended_action").notNull(),
  },
  (table) => [index("risk_dimension_scores_case_id_idx").on(table.caseId)],
);

export const evidenceItems = pgTable(
  "evidence_items",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    caseId: varchar("case_id", { length: 64 }).notNull(),
    dimension: varchar("dimension", { length: 32 }).notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    sourceName: text("source_name").notNull(),
    sourceType: varchar("source_type", { length: 32 }).notNull(),
    url: text("url"),
    confidence: integer("confidence").notNull(),
    riskLevel: varchar("risk_level", { length: 16 }).notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("evidence_items_case_id_idx").on(table.caseId)],
);

export const providerRuns = pgTable(
  "provider_runs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    caseId: varchar("case_id", { length: 64 }).notNull(),
    providerName: text("provider_name").notNull(),
    status: varchar("status", { length: 16 }).notNull(),
    errors: jsonb("errors").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("provider_runs_case_id_idx").on(table.caseId)],
);

export const generatedReports = pgTable(
  "generated_reports",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    caseId: varchar("case_id", { length: 64 }).notNull(),
    version: integer("version").notNull(),
    fileName: text("file_name").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("generated_reports_case_id_idx").on(table.caseId)],
);

/**
 * AI実行APIのコスト暴走ガード（レート制限）用カウンタ。
 * bucketKeyは「識別単位(user/anon) + 時間窓の種類(短時間窓/日次) + 窓の開始時刻や日付」を
 * エンコードした固定窓(fixed window)方式のキーであり、窓が変わると新しい行になるため
 * 自然にリセットされる。countはPostgresのUPSERT(ON CONFLICT DO UPDATE)で原子的に
 * インクリメントするため、複数インスタンス(水平スケール)環境でも安全に共有できる。
 * 詳細は src/lib/ai/rate-limit.ts を参照。
 */
export const aiRateLimitBuckets = pgTable("ai_rate_limit_buckets", {
  bucketKey: varchar("bucket_key", { length: 300 }).primaryKey(),
  count: integer("count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

/**
 * メール確認コード（OTP）。ログイン時のメール確認・管理者ログイン強化に使用する。
 * codeHashはコードそのものではなく、サーバー秘密鍵によるHMAC-SHA256ハッシュを保存する
 * （DBを閲覧できる者がコードをそのまま読み取れないようにするため）。
 * 1コード1回限り（consumedAtが入ったら再利用不可）、expiresAtを過ぎたコードも無効。
 * attemptsは誤入力の試行回数で、一定回数を超えたら無効化する（総当たり対策）。
 * 詳細は src/lib/auth/otp.ts を参照。
 */
export const otpCodes = pgTable(
  "otp_codes",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    purpose: varchar("purpose", { length: 32 }).notNull(),
    codeHash: varchar("code_hash", { length: 128 }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("otp_codes_email_purpose_idx").on(table.email, table.purpose),
  ],
);

/**
 * 重要操作（案件削除・復元など）の監査ログ。
 * 「誰が・いつ・何に対して何をしたか」を残すための汎用テーブルであり、
 * 将来的に削除以外の重要操作（編集・再生成等）にも同じ仕組みを流用できる。
 * 詳細は docs/case-deletion-design.md 6章を参照。
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    actorEmail: varchar("actor_email", { length: 255 }).notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    targetId: varchar("target_id", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("audit_logs_target_id_idx").on(table.targetId),
    index("audit_logs_action_idx").on(table.action),
  ],
);