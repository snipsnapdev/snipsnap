CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."shared_templates"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "template_id" uuid NOT NULL, "share_to_user_id" uuid NOT NULL, "shared_by_user_ud" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("template_id") REFERENCES "public"."templates"("id") ON UPDATE no action ON DELETE no action);
