const { unshareTemplateMutation } = require("../mutations");

const { getUserByEmail } = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const unshareTemplate = async (_, args, { userId }) => {
  const { share_by_user_id } = args.object;

  if (!userId && !share_by_user_id) return;

  const shareToUserId = await getUserByEmail(args.object.share_to_user_email);

  // can't unshare with yourself
  if (userId === shareToUserId) {
    return;
  }

  const { template_id } = args.object;

  const data = await gqlClient.request(unshareTemplateMutation, {
    template_id: template_id,
    user_to: shareToUserId,
    user_by: userId || share_by_user_id,
  });

  return data?.delete_shared_templates?.returning?.[0] || null;
};

module.exports = { unshareTemplate };
