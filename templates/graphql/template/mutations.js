const { gql } = require("apollo-server");

const createTemplateMutation = gql`
  mutation (
    $name: String!
    $prompts: jsonb
    $files: jsonb!
    $template_group_id: uuid
    $owner_id: uuid!
  ) {
    insert_templates_one(
      object: {
        name: $name
        files: $files
        prompts: $prompts
        template_group_id: $template_group_id
        owner_id: $owner_id
      }
    ) {
      id
      name
      prompts
      files
      template_group_id
      owner_id
    }
  }
`;

const updateTemplateMutation = gql`
  mutation (
    $id: uuid!
    $name: String
    $prompts: jsonb
    $files: jsonb
    $template_group_id: uuid
  ) {
    update_templates_by_pk(
      pk_columns: { id: $id }
      _set: {
        name: $name
        files: $files
        prompts: $prompts
        template_group_id: $template_group_id
      }
    ) {
      id
      name
      prompts
      files
      template_group_id
      owner_id
    }
  }
`;

module.exports = { createTemplateMutation, updateTemplateMutation };
