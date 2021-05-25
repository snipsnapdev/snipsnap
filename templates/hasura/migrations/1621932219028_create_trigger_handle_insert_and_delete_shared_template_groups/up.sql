DROP TRIGGER IF EXISTS create_user_available_template_group_when_shared_template_group_created ON shared_template_groups;
DROP FUNCTION IF EXISTS create_user_available_template_group_from_shared_template_group;

CREATE FUNCTION handle_shared_template_groups()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        DELETE FROM user_available_template_groups WHERE available_for_user_id = OLD.shared_to_user_id AND template_group_id = OLD.template_group_id;
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
         INSERT INTO user_available_template_groups(template_group_id, available_for_user_id) VALUES (NEW.template_group_id,NEW.shared_to_user_id);
         RETURN NEW;
    END IF;
END;
$$;

CREATE TRIGGER handle_shared_template_groups
   AFTER INSERT OR DELETE ON shared_template_groups
   FOR EACH ROW EXECUTE PROCEDURE handle_shared_template_groups();
