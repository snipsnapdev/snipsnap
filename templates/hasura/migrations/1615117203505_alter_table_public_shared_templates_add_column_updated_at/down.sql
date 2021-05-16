DROP TRIGGER IF EXISTS "set_public_shared_templates_updated_at" ON "public"."shared_templates";
ALTER TABLE "public"."shared_templates" DROP COLUMN "updated_at";
