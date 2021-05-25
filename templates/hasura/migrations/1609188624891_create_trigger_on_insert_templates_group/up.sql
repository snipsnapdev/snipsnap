CREATE TRIGGER create_new_templates_group
    AFTER  INSERT ON templates_groups
   FOR EACH  ROW EXECUTE PROCEDURE insert_data_from_templates_groups_to_users_templates_groups();
