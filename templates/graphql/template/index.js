const { createTemplate } = require("./resolvers/create-template");
const { updateTemplate } = require("./resolvers/update-template");
const { shareTemplate } = require("./resolvers/share-template");
const { shareTemplateGroup } = require("./resolvers/share-template-group");
const { unshareTemplate } = require("./resolvers/unshare-template");
const {
  unshareTemplateFromCurrentUser,
} = require("./resolvers/unshare-template-from-current-user");
const { unshareTemplateGroup } = require("./resolvers/unshare-template-group");
const {
  unshareTemplateGroupFromCurrentUser,
} = require("./resolvers/unshare-template-group-from-current-user");

module.exports = {
  createTemplate,
  updateTemplate,
  shareTemplate,
  shareTemplateGroup,
  unshareTemplate,
  unshareTemplateFromCurrentUser,
  unshareTemplateGroup,
  unshareTemplateGroupFromCurrentUser,
};
