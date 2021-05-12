alter table "public"."shared_templates" drop constraint "shared_templates_template_id_fkey",
  add constraint "shared_templates_template_id_fkey"
  foreign key ("template_id")
  references "public"."templates"
  ("id") on update no action on delete cascade;
