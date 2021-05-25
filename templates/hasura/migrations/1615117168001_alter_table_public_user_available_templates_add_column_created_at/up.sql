ALTER TABLE "public"."user_available_templates" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
