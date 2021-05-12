CREATE FUNCTION insert_data_from_templates_groups_to_users_templates_groups()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
 INSERT INTO users_templates_groups(user_id, templates_group_id) VALUES (NEW.user_id,NEW.id);
 RETURN NEW;
END;
$$;
