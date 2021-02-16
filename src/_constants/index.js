const vscode = require("vscode");

const COMMANDS = {
  RUN_EXTENSION: "templator.runTemplator",
};

const DEFAULT_TEMPLATES_FOLDER_PATH = `${vscode.workspace.workspaceFolders[0].uri.path}/.vscode/snipsnap/templates`;

const DEFAULT_TEMPLATE_FOLDER_NAME = "template";
const DEFAULT_CONFIG_FILE_NAME = "config.snipsnap.json";

module.exports = {
  COMMANDS,
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_TEMPLATE_FOLDER_NAME,
  DEFAULT_CONFIG_FILE_NAME,
};
