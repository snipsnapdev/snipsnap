alter table "public"."accounts"
           add constraint "accounts_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("id") on update restrict on delete cascade;
