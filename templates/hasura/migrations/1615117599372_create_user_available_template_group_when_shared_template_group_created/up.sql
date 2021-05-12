CREATE FUNCTION create_user_available_template_group_from_shared_template_group()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
 INSERT INTO user_available_template_groups(template_group_id, available_for_user_id) VALUES (NEW.template_group_id,NEW.shared_to_user_id);
 RETURN NEW;
END;
$$;

CREATE TRIGGER create_user_available_template_group_when_shared_template_group_created
    AFTER  INSERT ON shared_template_groups
   FOR EACH  ROW EXECUTE PROCEDURE create_user_available_template_group_from_shared_template_group();
