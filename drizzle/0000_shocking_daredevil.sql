CREATE TABLE IF NOT EXISTS "ai_consultations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"case_id" varchar(64),
	"mode" varchar(64) NOT NULL,
	"question" text NOT NULL,
	"source_url" text,
	"source_text" text,
	"fetched_url_text" text,
	"source_fetch_status" varchar(32),
	"answer_title" text NOT NULL,
	"answer" text NOT NULL,
	"confidence_label" varchar(16),
	"document_summary" text,
	"judgement" text,
	"fact_highlights" jsonb,
	"assumption_highlights" jsonb,
	"related_clauses" jsonb,
	"keyword_highlights" jsonb,
	"follow_up_questions" jsonb,
	"citations" jsonb,
	"recommended_checks" jsonb,
	"feedback" varchar(32),
	"feedback_comment" text,
	"case_draft" jsonb,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_rate_limit_buckets" (
	"bucket_key" varchar(300) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"session_id" varchar(64) NOT NULL,
	"visitor_id" varchar(128) NOT NULL,
	"user_email" varchar(255),
	"event_name" varchar(64) NOT NULL,
	"path" text NOT NULL,
	"from_path" text,
	"to_path" text,
	"label" text,
	"meta" jsonb,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "analytics_sessions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"visitor_id" varchar(128) NOT NULL,
	"user_email" varchar(255),
	"entry_path" text NOT NULL,
	"exit_path" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"device_type" varchar(32) NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"last_seen_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"actor_email" varchar(255) NOT NULL,
	"action" varchar(64) NOT NULL,
	"target_id" varchar(64) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cases" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"product_name" text NOT NULL,
	"model_number" text NOT NULL,
	"destination_country" text NOT NULL,
	"customer_company_name" text NOT NULL,
	"product_image_url" text,
	"status" varchar(32) NOT NULL,
	"checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "evidence_items" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"dimension" varchar(32) NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"source_name" text NOT NULL,
	"source_type" varchar(32) NOT NULL,
	"url" text,
	"confidence" integer NOT NULL,
	"risk_level" varchar(16) NOT NULL,
	"captured_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "generated_reports" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"version" integer NOT NULL,
	"file_name" text NOT NULL,
	"generated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investigations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"status" varchar(32) NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_runs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"provider_name" text NOT NULL,
	"status" varchar(16) NOT NULL,
	"errors" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "risk_assessments" (
	"case_id" varchar(64) PRIMARY KEY NOT NULL,
	"summary" jsonb NOT NULL,
	"report_narrative" text NOT NULL,
	"dimensions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"model_results" jsonb,
	"agreement_rate" integer,
	"review_meeting" jsonb,
	"improvement_steps" jsonb,
	"worst_case_scenarios" jsonb,
	"disagreement_dimensions" jsonb,
	"cross_review" jsonb,
	"regulation_updates" jsonb,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "risk_dimension_scores" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"case_id" varchar(64) NOT NULL,
	"dimension" varchar(32) NOT NULL,
	"label" text NOT NULL,
	"score" integer NOT NULL,
	"grade" varchar(8) NOT NULL,
	"rationale" text NOT NULL,
	"recommended_action" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_consultations_user_email_idx" ON "ai_consultations" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ai_consultations_case_id_idx" ON "ai_consultations" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_event_name_idx" ON "analytics_events" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_sessions_visitor_id_idx" ON "analytics_sessions" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_sessions_user_email_idx" ON "analytics_sessions" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_sessions_started_at_idx" ON "analytics_sessions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_target_id_idx" ON "audit_logs" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cases_user_email_idx" ON "cases" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cases_deleted_at_idx" ON "cases" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "evidence_items_case_id_idx" ON "evidence_items" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "generated_reports_case_id_idx" ON "generated_reports" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "investigations_case_id_idx" ON "investigations" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "provider_runs_case_id_idx" ON "provider_runs" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "risk_dimension_scores_case_id_idx" ON "risk_dimension_scores" USING btree ("case_id");