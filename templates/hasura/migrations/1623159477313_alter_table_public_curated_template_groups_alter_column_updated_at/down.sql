alter table "public"."curated_template_groups" alter column "updated_at" drop not null;
alter table "public"."curated_template_groups" alter column "updated_at" drop default;
