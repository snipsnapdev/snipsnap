alter table "public"."curated_template_groups" alter column "updated_at" set default now();
alter table "public"."curated_template_groups" alter column "updated_at" set not null;
