DROP TRIGGER IF EXISTS "set_public_accounts_updated_at" ON "public"."accounts";
ALTER TABLE "public"."accounts" DROP COLUMN "updated_at";
