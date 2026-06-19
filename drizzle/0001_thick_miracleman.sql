ALTER TABLE "ai_consultations" ADD COLUMN "confidence_label" varchar(16);--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "document_summary" text;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "fact_highlights" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "assumption_highlights" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "related_clauses" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "keyword_highlights" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "follow_up_questions" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "citations" jsonb;--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "feedback" varchar(32);--> statement-breakpoint
ALTER TABLE "ai_consultations" ADD COLUMN "feedback_comment" text;--> statement-breakpoint
ALTER TABLE "risk_assessments" ADD COLUMN "regulation_updates" jsonb;