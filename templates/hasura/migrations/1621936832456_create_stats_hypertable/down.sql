-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE TABLE IF NOT EXISTS "public"."stats" ("user_id" uuid NOT NULL, "timestamp" timestamptz NOT NULL DEFAULT now(), "event" text NOT NULL, "metadata" text, FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON UPDATE cascade ON DELETE no action);
SELECT create_hypertable('stats','timestamp');
