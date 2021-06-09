const { shareTemplateQuery } = require("../queries");

const { getUserByEmail } = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const { gql } = require("apollo-server");

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

const checkIfGroupAlreadyShared = async ({
  toUserId,
  byUserId,
  templateGroupId,
}) => {
  const queryData = await gqlClient.request(checkIfTemplateGroupSharedQuery, {
    templateGroupId,
    byUserId,
    toUserId,
  });

  if (queryData?.shared_template_groups?.length > 0) {
    return true;
  }

  return false;
};

const shareTemplateGroup = async (_, args, { userId }) => {
  if (!userId) return;
  const shareToUserId = await getUserByEmail(args.object.share_to_user_email);

  // Can't share with yourself
  if (shareToUserId === userId) return;

  const { template_group_id } = args.object;

  const isAlreadyShared = await checkIfGroupAlreadyShared({
    templateGroupId: template_group_id,
    toUserId: shareToUserId,
    byUserId: userId,
  });

  // If template group is already shared then we do not need to share it again
  if (isAlreadyShared) return;

  // share template group
  const mutationData = await gqlClient.request(shareTemplateGroupMutation, {
    template_group_id: template_group_id,
    user_by: userId,
    user_to: shareToUserId,
  });

  // share all templates inside that group
  const templateData = await gqlClient.request(getTemplateGroupByIdQuery, {
    templateGroupId: template_group_id,
  });

  const templateIds =
    templateData?.template_groups?.[0]?.templates.map((item) => item.id) || [];

  if (templateIds.length > 0) {
    await Promise.all(
      templateIds.map((templateId) =>
        gqlClient.request(shareTemplateQuery, {
          templateId,
          shareToUserEmail: args.object.share_to_user_email,
          shareByUserId: userId,
        })
      )
    );
  }

  return mutationData?.insert_shared_template_groups_one || null;
};

module.exports = { shareTemplateGroup };
