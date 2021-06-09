const { gql } = require("apollo-server");

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

const checkIfTemplateGroupSharedQuery = gql`
  query ($templateGroupId: uuid!, $byUserId: uuid!, $toUserId: uuid!) {
    shared_template_groups(
      where: {
        _and: [
          { template_group_id: { _eq: $templateGroupId } }
          { shared_by_user_id: { _eq: $byUserId } }
          { shared_to_user_id: { _eq: $toUserId } }
        ]
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

const getTemplateGroupByIdQuery = gql`
  query ($templateGroupId: uuid!) {
    template_groups(where: { id: { _eq: $templateGroupId } }) {
      id
      templates {
        id
      }
    }
  }
`;

module.exports = {
  getUsersTemplateGroupSharedTo,
  checkIfTemplateGroupSharedQuery,
  getTemplateGroupByIdQuery,
};
