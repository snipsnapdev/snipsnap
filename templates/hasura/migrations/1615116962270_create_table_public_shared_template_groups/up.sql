CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."shared_template_groups"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "template_group_id" uuid NOT NULL, "shared_to_user_id" uuid NOT NULL, "shared_by_user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("template_group_id") REFERENCES "public"."template_groups"("id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("shared_to_user_id") REFERENCES "public"."users"("user_id") ON UPDATE restrict ON DELETE cascade, FOREIGN KEY ("shared_by_user_id") REFERENCES "public"."users"("user_id") ON UPDATE restrict ON DELETE cascade);