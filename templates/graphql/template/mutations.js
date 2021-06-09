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

const shareTemplateByEmailMutation = gql`
  mutation shareTemplate(
    $templateId: String!
    $shareToUserEmail: String!
    $shareByUserId: String
  ) {
    share_template(
      object: {
        template_id: $templateId
        share_to_user_email: $shareToUserEmail
        share_by_user_id: $shareByUserId
      }
    ) {
      id
    }
  }
`;

const shareTemplateMutation = gql`
  mutation ($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
    insert_shared_templates_one(
      object: {
        template_id: $template_id
        shared_by_user_id: $user_by
        shared_to_user_id: $user_to
      }
    ) {
      id
      template_id
      shared_by_user_id
      shared_to_user_id
      created_at
      updated_at
    }
  }
`;

const shareTemplateGroupMutation = gql`
  mutation ($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
    insert_shared_template_groups_one(
      object: {
        template_group_id: $template_group_id
        shared_by_user_id: $user_by
        shared_to_user_id: $user_to
      }
    ) {
      id
      template_group_id
      shared_by_user_id
      shared_to_user_id
      created_at
      updated_at
    }
  }
`;

const unshareTemplateMutation = gql`
  mutation ($template_id: uuid!, $user_by: uuid, $user_to: uuid!) {
    delete_shared_templates(
      where: {
        template_id: { _eq: $template_id }
        shared_by_user_id: { _eq: $user_by }
        shared_to_user_id: { _eq: $user_to }
      }
    ) {
      returning {
        id
        template_id
        shared_by_user_id
        shared_to_user_id
        created_at
        updated_at
      }
    }
  }
`;

const unshareTemplateByEmailMutation = gql`
  mutation shareTemplate(
    $templateId: String!
    $shareToUserEmail: String!
    $shareByUserId: String
  ) {
    unshare_template(
      object: {
        template_id: $templateId
        share_to_user_email: $shareToUserEmail
        share_by_user_id: $shareByUserId
      }
    ) {
      shared_to_user_id
    }
  }
`;

const unshareTemplateGroupMutation = gql`
  mutation ($template_group_id: uuid!, $user_by: uuid, $user_to: uuid!) {
    delete_shared_template_groups(
      where: {
        template_group_id: { _eq: $template_group_id }
        shared_by_user_id: { _eq: $user_by }
        shared_to_user_id: { _eq: $user_to }
      }
    ) {
      returning {
        id
        template_group_id
        shared_by_user_id
        shared_to_user_id
        created_at
        updated_at
      }
    }
  }
`;

module.exports = {
  createTemplateMutation,
  updateTemplateMutation,
  shareTemplateMutation,
  shareTemplateByEmailMutation,
  shareTemplateGroupMutation,
  unshareTemplateMutation,
  unshareTemplateByEmailMutation,
  unshareTemplateGroupMutation,
};
