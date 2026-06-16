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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("cases_user_email_idx").on(table.userEmail)],
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

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