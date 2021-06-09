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

// sharing
export const shareTemplateGroupMutation = gql`
  mutation shareTemplateGroup($groupId: String!, $shareToUserEmail: String!) {
    share_template_group(
      object: { template_group_id: $groupId, share_to_user_email: $shareToUserEmail }
    ) {
      id
    }
  }
`;

export const shareTemplateMutation = gql`
  mutation shareTemplate($templateId: String!, $shareToUserEmail: String!) {
    share_template(object: { template_id: $templateId, share_to_user_email: $shareToUserEmail }) {
      id
    }
  }
`;

export const shareTemplateToAllMutation = gql`
  mutation shareTemplate($templateId: uuid!, $isPublic: Boolean!) {
    update_templates_by_pk(pk_columns: { id: $templateId }, _set: { is_public: $isPublic }) {
      id
      is_public
    }
  }
`;

// unsharing
export const unshareTemplateGroupMutation = gql`
  mutation unshareTemplateGroup($groupId: String!, $shareToUserEmail: String!) {
    unshare_template_group(
      object: { template_group_id: $groupId, share_to_user_email: $shareToUserEmail }
    ) {
      shared_to_user_id
    }
  }
`;

export const unshareTemplateMutation = gql`
  mutation unshareTemplate($templateId: String!, $shareToUserEmail: String!) {
    unshare_template(object: { template_id: $templateId, share_to_user_email: $shareToUserEmail }) {
      shared_to_user_id
    }
  }
`;
