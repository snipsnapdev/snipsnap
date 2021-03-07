alter table "public"."sessions"
           add constraint "sessions_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("id") on update restrict on delete cascade;
