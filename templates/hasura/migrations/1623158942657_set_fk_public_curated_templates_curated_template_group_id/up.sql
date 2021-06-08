alter table "public"."curated_templates"
  add constraint "curated_templates_curated_template_group_id_fkey"
  foreign key ("curated_template_group_id")
  references "public"."curated_template_groups"
  ("id") on update restrict on delete cascade;
