CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."user_available_template_groups"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "template_group_id" uuid NOT NULL, "available_for_user_id" uuid NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("template_group_id") REFERENCES "public"."template_groups"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("available_for_user_id") REFERENCES "public"."users"("user_id") ON UPDATE restrict ON DELETE cascade);
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
CREATE TRIGGER "set_public_user_available_template_groups_updated_at"
BEFORE UPDATE ON "public"."user_available_template_groups"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_user_available_template_groups_updated_at" ON "public"."user_available_template_groups" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
