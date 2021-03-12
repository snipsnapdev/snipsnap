ALTER TABLE "public"."shared_template_groups" ADD COLUMN "created_at" timestamptz NULL DEFAULT now();
