alter table "public"."template_groups" drop constraint "templates_groups_user_id_fkey",
             add constraint "template_groups_owner_id_fkey"
             foreign key ("owner_id")
             references "public"."users"
             ("user_id") on update restrict on delete cascade;
