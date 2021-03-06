alter table "public"."curated_templates" drop constraint "curated_templates_template_id_fkey",
  add constraint "curated_templates_template_id_fkey"
  foreign key ("template_id")
  references "public"."templates"
  ("id") on update cascade on delete restrict;
