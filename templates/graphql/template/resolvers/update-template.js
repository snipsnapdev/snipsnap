const { updateTemplateMutation } = require("../mutations");
const { validatePrompts, validateFiles } = require("../../utils/validation");

const { gqlClient } = require("../../api/client");

const updateTemplate = async (_, args, { userId }) => {
  if (!userId) return;

  const { id, name, prompts, files, template_group_id } = args.object;

  const isPromptsValid = validatePrompts(JSON.parse(prompts));
  const isFilesValid = validateFiles(JSON.parse(files));

  if (!isPromptsValid || !isFilesValid) return;

  return gqlClient.request(updateTemplateMutation, {
    id,
    name,
    prompts,
    files,
    template_group_id,
  });
};

module.exports = { updateTemplate };
