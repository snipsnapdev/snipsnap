DROP TRIGGER IF EXISTS "set_public_sessions_updated_at" ON "public"."sessions";
ALTER TABLE "public"."sessions" DROP COLUMN "updated_at";
