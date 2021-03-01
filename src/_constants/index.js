const vscode = require("vscode");

const COMMANDS = {
  RUN_EXTENSION: "snipsnap-templates.runExtension",
};

const DEFAULT_TEMPLATES_FOLDER_PATH = `${vscode.workspace.workspaceFolders[0].uri.path}/.vscode/templates`;
const DEFAULT_CONFIG_FILE_NAME = ".snipsnap.json";

module.exports = {
  COMMANDS,
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_CONFIG_FILE_NAME,
};
