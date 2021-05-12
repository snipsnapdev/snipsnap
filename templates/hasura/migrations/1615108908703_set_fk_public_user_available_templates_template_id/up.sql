alter table "public"."user_available_templates"
           add constraint "user_available_templates_template_id_fkey"
           foreign key ("template_id")
           references "public"."templates"
           ("id") on update no action on delete no action;
