ALTER TABLE "public"."sessions" ADD COLUMN "updated_at" timestamptz;
ALTER TABLE "public"."sessions" ALTER COLUMN "updated_at" DROP NOT NULL;
ALTER TABLE "public"."sessions" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
