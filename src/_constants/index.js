const vscode = require("vscode");

const COMMANDS = {
  RUN_EXTENSION: "templator.runTemplator",
};

const DEFAULT_TEMPLATES_FOLDER_PATH = `${vscode.workspace.workspaceFolders[0].uri.path}/.vscode/snipsnap-templator`;
const DEFAULT_CONFIG_FILE_NAME = ".snipsnap-templator.config.json";

module.exports = {
  COMMANDS,
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_CONFIG_FILE_NAME,
};
