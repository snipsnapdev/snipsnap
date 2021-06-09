const { checkIfTemplateSharedQuery } = require("../queries");
const { shareTemplateMutation } = require("../mutations");

const { getUserByEmail } = require("../../utils/helpers");
const { gqlClient } = require("../../api/client");

const checkIfTemplateAlreadyShared = async ({
  toUserId,
  byUserId,
  templateId,
}) => {
  const queryData = await gqlClient.request(checkIfTemplateSharedQuery, {
    templateId,
    byUserId,
    toUserId,
  });

  if (queryData?.shared_templates?.length > 0) {
    return true;
  }

  return false;
};

const shareTemplate = async (_, args, { userId }) => {
  const { template_id, share_by_user_id } = args.object;

  if (!userId && !share_by_user_id) return;

  let shareToUserId = null;

  try {
    shareToUserId = await getUserByEmail(args.object.share_to_user_email);
  } catch (err) {
    throw new Error(err.message);
  }

  // Can't share with yourself
  if (shareToUserId === userId) {
    throw new Error("Can't share with yourself");
  }

  const isAlreadyShared = await checkIfTemplateAlreadyShared({
    templateId: template_id,
    toUserId: shareToUserId,
    byUserId: userId,
  });

  // If template is already shared then we do not need to share it again
  if (isAlreadyShared) return;

  const mutationData = await gqlClient.request(shareTemplateMutation, {
    template_id: template_id,
    user_by: userId || share_by_user_id,
    user_to: shareToUserId,
  });

  return mutationData?.insert_shared_templates_one || null;
};

module.exports = { shareTemplate };
