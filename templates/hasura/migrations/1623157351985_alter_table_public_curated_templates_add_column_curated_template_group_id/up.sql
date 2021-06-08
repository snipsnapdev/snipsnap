alter table "public"."curated_templates" add column "curated_template_group_id" uuid
 not null unique;
