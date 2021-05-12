DROP TRIGGER IF EXISTS "set_public_shared_template_groups_updated_at" ON "public"."shared_template_groups";
ALTER TABLE "public"."shared_template_groups" DROP COLUMN "updated_at";
