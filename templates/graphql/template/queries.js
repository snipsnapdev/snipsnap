const { gql } = require("apollo-server");

const shareTemplateQuery = gql`
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

const getUsersTemplateGroupSharedTo = gql`
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

module.exports = { shareTemplateQuery, getUsersTemplateGroupSharedTo };
