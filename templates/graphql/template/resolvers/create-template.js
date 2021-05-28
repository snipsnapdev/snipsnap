const { createTemplateMutation } = require("../mutations");
const {
  shareTemplateQuery,
  getUsersTemplateGroupSharedTo,
} = require("../queries");
const { validatePrompts, validateFiles } = require("../../utils/validation");

const { gqlClient } = require("../../api/client");

const createTemplate = async (_, args, { userId }) => {
  if (!userId) return;

  const { name, prompts, files, template_group_id } = args.object;

  validatePrompts(JSON.parse(prompts));
  validateFiles(JSON.parse(files));

  const res = await gqlClient.request(createTemplateMutation, {
    name,
    prompts,
    files,
    template_group_id,
    owner_id: userId,
  });

  // if group was shared - share this template with all that users
  if (template_group_id && res?.insert_templates_one?.id) {
    // find users group was shared to
    const users = await gqlClient.request(getUsersTemplateGroupSharedTo, {
      groupId: template_group_id,
    });
    const userEmails =
      users?.shared_template_groups.map((item) => item.shared_to_user.email) ||
      [];

    // share template
    if (userEmails.length > 0) {
      await Promise.all(
        userEmails.map((email) =>
          gqlClient.request(shareTemplateQuery, {
            templateId: res.insert_templates_one.id,
            shareToUserEmail: email,
            shareByUserId: userId,
          })
        )
      );
    }
  }

  return res?.insert_templates_one;
};

module.exports = { createTemplate };
