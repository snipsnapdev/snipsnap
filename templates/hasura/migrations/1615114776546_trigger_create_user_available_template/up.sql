CREATE FUNCTION create_user_available_template_from_template()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
 INSERT INTO user_available_templates(template_id, available_for_user_id) VALUES (NEW.id,NEW.owner_id);
 RETURN NEW;
END;
$$;

CREATE TRIGGER create_user_available_template_when_template_created
    AFTER  INSERT ON templates
   FOR EACH  ROW EXECUTE PROCEDURE create_user_available_template_from_template();
