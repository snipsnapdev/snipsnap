CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."templates"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "prompts" jsonb NOT NULL, "files" jsonb NOT NULL, "owner_id" uuid NOT NULL, "template_group_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_templates_updated_at"
BEFORE UPDATE ON "public"."templates"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_templates_updated_at" ON "public"."templates" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
