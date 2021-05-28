const { updateTemplateMutation } = require("../mutations");
const { validatePrompts, validateFiles } = require("../../utils/validation");

const { gqlClient } = require("../../api/client");

const updateTemplate = async (_, args, { userId }) => {
  if (!userId) return;

  const { id, name, prompts, files, template_group_id } = args.object;

  validatePrompts(JSON.parse(prompts));
  validateFiles(JSON.parse(files));

  return gqlClient.request(updateTemplateMutation, {
    id,
    name,
    prompts,
    files,
    template_group_id,
  });
};

module.exports = { updateTemplate };
