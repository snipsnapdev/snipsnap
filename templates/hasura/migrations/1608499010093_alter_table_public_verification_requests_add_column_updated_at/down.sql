DROP TRIGGER IF EXISTS "set_public_verification_requests_updated_at" ON "public"."verification_requests";
ALTER TABLE "public"."verification_requests" DROP COLUMN "updated_at";
