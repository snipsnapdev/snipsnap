alter table "public"."curated_templates" alter column "name" drop not null;
alter table "public"."curated_templates" add column "name" text;
