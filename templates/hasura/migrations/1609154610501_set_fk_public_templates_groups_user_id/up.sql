alter table "public"."templates_groups"
           add constraint "templates_groups_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("user_id") on update restrict on delete restrict;
