import { gql } from 'api/graphql';

export const createTemplateMutation = gql`
  mutation createTemplate(
    $name: String!
    $prompts: String
    $files: String!
    $templateGroupId: String
  ) {
    insert_template(
      object: { name: $name, files: $files, prompts: $prompts, template_group_id: $templateGroupId }
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

export const editTemplateMutation = gql`
  mutation updateTemplate(
    $id: String!
    $name: String
    $prompts: String
    $files: String
    $templateGroupId: String
  ) {
    update_template(
      object: {
        id: $id
        name: $name
        prompts: $prompts
        files: $files
        template_group_id: $templateGroupId
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
