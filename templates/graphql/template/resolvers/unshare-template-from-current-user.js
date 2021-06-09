const { unshareTemplateMutation } = require("../mutations");

const { getUserByEmail } = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const unshareTemplateFromCurrentUser = async (_, args, { userId }) => {
  const { share_to_user_email, template_id } = args.object;

  let shareToUserId;
  if (!userId) {
    shareToUserId = await getUserByEmail(share_to_user_email);
  }

  if (!userId && !shareToUserId) {
    return;
  }

  const data = await gqlClient.request(unshareTemplateMutation, {
    template_id: template_id,
    user_to: userId || shareToUserId,
  });

  return data?.delete_shared_templates?.returning?.[0] || null;
};

module.exports = { unshareTemplateFromCurrentUser };
