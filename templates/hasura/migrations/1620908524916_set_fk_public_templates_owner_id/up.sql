alter table "public"."templates" drop constraint "templates_owner_id_fkey",
  add constraint "templates_owner_id_fkey"
  foreign key ("owner_id")
  references "public"."users"
  ("user_id") on update restrict on delete cascade;
