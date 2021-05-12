CREATE FUNCTION create_default_templates_group()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
 INSERT INTO templates_groups(name, user_id) VALUES ('Default',NEW.user_id);
 RETURN NEW;
END;
$$;
