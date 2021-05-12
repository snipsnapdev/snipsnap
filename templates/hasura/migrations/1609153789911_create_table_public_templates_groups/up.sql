CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."templates_groups"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "user_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_templates_groups_updated_at"
BEFORE UPDATE ON "public"."templates_groups"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_templates_groups_updated_at" ON "public"."templates_groups" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
