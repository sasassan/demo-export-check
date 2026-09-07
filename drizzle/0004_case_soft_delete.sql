ALTER TABLE "cases" ADD COLUMN "deleted_at" timestamp with time zone;
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"actor_email" varchar(255) NOT NULL,
	"action" varchar(64) NOT NULL,
	"target_id" varchar(64) NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cases_deleted_at_idx" ON "cases" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "audit_logs_target_id_idx" ON "audit_logs" USING btree ("target_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
