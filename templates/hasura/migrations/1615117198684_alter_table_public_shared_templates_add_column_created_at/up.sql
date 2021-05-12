ALTER TABLE "public"."shared_templates" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
