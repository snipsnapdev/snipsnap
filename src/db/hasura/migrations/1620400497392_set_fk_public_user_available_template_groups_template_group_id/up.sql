alter table "public"."user_available_template_groups" drop constraint "user_available_template_groups_template_group_id_fkey",
  add constraint "user_available_template_groups_template_group_id_fkey"
  foreign key ("template_group_id")
  references "public"."template_groups"
  ("id") on update restrict on delete cascade;
