const { createTemplate } = require("./resolvers/create-template");
const { updateTemplate } = require("./resolvers/update-template");
const { shareTemplateGroup } = require("./resolvers/share-template-group");

module.exports = { createTemplate, updateTemplate, shareTemplateGroup };
