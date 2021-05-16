ALTER TABLE "public"."users" ADD COLUMN "updated_at" timestamptz;
ALTER TABLE "public"."users" ALTER COLUMN "updated_at" DROP NOT NULL;
ALTER TABLE "public"."users" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
