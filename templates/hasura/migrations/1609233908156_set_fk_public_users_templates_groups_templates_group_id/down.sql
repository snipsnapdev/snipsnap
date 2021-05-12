alter table "public"."users_templates_groups" drop constraint "users_templates_groups_templates_group_id_fkey",
          add constraint "users_templates_groups_template_group_id_fkey"
          foreign key ("templates_group_id")
          references "public"."templates_groups"
          ("id")
          on update restrict
          on delete restrict;
