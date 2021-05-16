alter table "public"."user_available_templates" drop constraint "user_available_templates_available_for_user_id_fkey",
          add constraint "user_available_templates_available_for_user_id_fkey"
          foreign key ("available_for_user_id")
          references "public"."users"
          ("user_id")
          on update no action
          on delete no action;
