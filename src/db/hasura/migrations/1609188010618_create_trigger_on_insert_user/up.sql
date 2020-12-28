CREATE TRIGGER create_new_user
    AFTER  INSERT ON users
   FOR EACH  ROW EXECUTE PROCEDURE create_default_templates_group();
