DROP TRIGGER IF EXISTS "set_public_users_updated_at" ON "public"."users";
ALTER TABLE "public"."users" DROP COLUMN "updated_at";
