const {
  unshareTemplateGroupMutation,
  unshareTemplateByEmailMutation,
} = require("../mutations");

const {
  getUserByEmail,
  getTemplateIdsInGroup,
} = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const unshareTemplateGroup = async (_, args, { userId }) => {
  if (!userId) return;

  const shareToUserId = await getUserByEmail(args.object.share_to_user_email);

  // Can't unshare from yourself. Yes, even if we let unshare mutation run, it won't delete anything since such item does not exist but still
  if (shareToUserId === userId) return;

  const { template_group_id } = args.object;

  const data = await gqlClient.request(unshareTemplateGroupMutation, {
    template_group_id: template_group_id,
    user_by: userId,
    user_to: shareToUserId,
  });

  // unshare all templates in that group
  const templateIds = await getTemplateIdsInGroup(template_group_id);

  // unshare all templates with the user removed from group
  if (templateIds.length > 0) {
    await Promise.all(
      templateIds.map((templateId) =>
        gqlClient.request(unshareTemplateByEmailMutation, {
          templateId,
          shareToUserEmail: args.object.share_to_user_email,
          shareByUserId: userId,
        })
      )
    );
  }

  return data?.delete_shared_template_groups?.returning?.[0] || null;
};

module.exports = { unshareTemplateGroup };
