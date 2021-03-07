alter table "public"."api_keys"
           add constraint "api_keys_user_id_fkey"
           foreign key ("user_id")
           references "public"."users"
           ("user_id") on update restrict on delete cascade;
