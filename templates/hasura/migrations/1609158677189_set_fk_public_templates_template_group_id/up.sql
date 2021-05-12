alter table "public"."templates"
           add constraint "templates_template_group_id_fkey"
           foreign key ("template_group_id")
           references "public"."templates_groups"
           ("id") on update restrict on delete restrict;
