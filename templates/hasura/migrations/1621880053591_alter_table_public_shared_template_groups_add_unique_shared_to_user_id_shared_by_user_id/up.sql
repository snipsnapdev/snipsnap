alter table "public"."shared_template_groups" add constraint "shared_template_groups_shared_to_user_id_shared_by_user_id_key" unique ("shared_to_user_id", "shared_by_user_id");
