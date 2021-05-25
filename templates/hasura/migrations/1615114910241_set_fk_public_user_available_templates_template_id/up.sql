alter table "public"."user_available_templates" drop constraint "user_available_templates_template_id_fkey",
             add constraint "user_available_templates_template_id_fkey"
             foreign key ("template_id")
             references "public"."templates"
             ("id") on update no action on delete cascade;
