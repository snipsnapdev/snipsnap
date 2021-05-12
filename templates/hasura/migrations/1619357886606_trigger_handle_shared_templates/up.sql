DROP TRIGGER IF EXISTS create_user_available_template_when_shared_template_created ON shared_templates;
DROP FUNCTION IF EXISTS create_user_available_template_from_shared_template;

CREATE FUNCTION handle_shared_templates()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        DELETE FROM user_available_templates WHERE available_for_user_id = OLD.shared_to_user_id AND template_id = OLD.template_id;
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
         INSERT INTO user_available_templates(template_id, available_for_user_id) VALUES (NEW.template_id,NEW.shared_to_user_id);
         RETURN NEW;
    END IF;
END;
$$;

CREATE TRIGGER handle_shared_templates
   AFTER INSERT OR DELETE ON shared_templates
   FOR EACH ROW EXECUTE PROCEDURE handle_shared_templates();
