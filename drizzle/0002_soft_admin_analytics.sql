CREATE TABLE "analytics_sessions" (
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
CREATE TABLE "analytics_events" (
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
CREATE INDEX "analytics_sessions_visitor_id_idx" ON "analytics_sessions" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "analytics_sessions_user_email_idx" ON "analytics_sessions" USING btree ("user_email");--> statement-breakpoint
CREATE INDEX "analytics_sessions_started_at_idx" ON "analytics_sessions" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "analytics_events_event_name_idx" ON "analytics_events" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");