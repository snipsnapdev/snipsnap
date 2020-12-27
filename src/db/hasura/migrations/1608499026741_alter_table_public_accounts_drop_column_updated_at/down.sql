ALTER TABLE "public"."accounts" ADD COLUMN "updated_at" timestamptz;
ALTER TABLE "public"."accounts" ALTER COLUMN "updated_at" DROP NOT NULL;
ALTER TABLE "public"."accounts" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
