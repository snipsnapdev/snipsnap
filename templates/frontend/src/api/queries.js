import { gql } from 'api/graphql';

export const getUsersTemplateGroupSharedTo = gql`
  query MyQuery($groupId: uuid!) {
    shared_template_groups(where: { template_group_id: { _eq: $groupId } }) {
      shared_to_user {
        id
        name
        image
        email
      }
    }
  }
`;

export const getUsersTemplateSharedTo = gql`
  query MyQuery($templateId: uuid!) {
    shared_templates(where: { template_id: { _eq: $templateId } }) {
      shared_to_user_id
      shared_to_user {
        id
        name
        image
        email
      }
    }
  }
`;

export const getTemplatePublicStatusQuery = gql`
  query MyQuery($templateId: uuid!) {
    templates(where: { id: { _eq: $templateId } }) {
      id
      is_public
    }
  }
`;
