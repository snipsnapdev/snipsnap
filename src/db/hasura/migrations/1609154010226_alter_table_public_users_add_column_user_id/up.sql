CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "public"."users" ADD COLUMN "user_id" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();
