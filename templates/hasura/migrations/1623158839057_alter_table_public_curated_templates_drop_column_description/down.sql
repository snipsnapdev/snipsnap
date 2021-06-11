alter table "public"."curated_templates" alter column "description" drop not null;
alter table "public"."curated_templates" add column "description" text;
