ALTER TABLE "public"."verification_requests" ADD COLUMN "updated_at" timestamptz;
ALTER TABLE "public"."verification_requests" ALTER COLUMN "updated_at" DROP NOT NULL;
ALTER TABLE "public"."verification_requests" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
