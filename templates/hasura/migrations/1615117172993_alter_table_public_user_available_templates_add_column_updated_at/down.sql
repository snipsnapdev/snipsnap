DROP TRIGGER IF EXISTS "set_public_user_available_templates_updated_at" ON "public"."user_available_templates";
ALTER TABLE "public"."user_available_templates" DROP COLUMN "updated_at";
