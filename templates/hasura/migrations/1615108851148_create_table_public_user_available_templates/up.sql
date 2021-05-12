CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."user_available_templates"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "template_id" uuid NOT NULL, "available_for_user_id" uuid NOT NULL, PRIMARY KEY ("id") ); COMMENT ON TABLE "public"."user_available_templates" IS E'Aggregated templates data by templates and shared_templates';
