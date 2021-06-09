const {
  checkIfTemplateGroupSharedQuery,
  getTemplateGroupByIdQuery,
} = require("../queries");
const {
  shareTemplateByEmailMutation,
  shareTemplateGroupMutation,
} = require("../mutations");

const {
  getUserByEmail,
  getTemplateIdsInGroup,
} = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

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
  const templateIds = await getTemplateIdsInGroup(template_group_id);

  if (templateIds.length > 0) {
    await Promise.all(
      templateIds.map((templateId) =>
        gqlClient.request(shareTemplateByEmailMutation, {
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
