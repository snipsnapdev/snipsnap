const {
  unshareTemplateGroupFromCurrentUserMutation,
  unshareTemplateFromCurrentUserMutation,
} = require("../mutations");

const { getTemplateIdsInGroup } = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const unshareTemplateGroupFromCurrentUser = async (_, args, { userId }) => {
  if (!userId) return;

  const { template_group_id } = args.object;

  const data = await gqlClient.request(
    unshareTemplateGroupFromCurrentUserMutation,
    {
      template_group_id: template_group_id,
      user_to: userId,
    }
  );

  // unshare all templates in that group
  const templateIds = await getTemplateIdsInGroup(template_group_id);

  if (templateIds.length > 0) {
    await Promise.all(
      templateIds.map((templateId) =>
        gqlClient.request(unshareTemplateFromCurrentUserMutation, {
          template_id: templateId,
          user_to: userId,
        })
      )
    );
  }

  return data?.delete_shared_template_groups?.returning?.[0] || null;
};

module.exports = { unshareTemplateGroupFromCurrentUser };
