const vscode = require("vscode");

const COMMANDS = {
  RUN_EXTENSION: "snipsnap-templates.runExtension",
};

const DEFAULT_TEMPLATES_FOLDER_PATH = `${vscode.workspace.workspaceFolders[0].uri.path}/.vscode/templates`;
const DEFAULT_CONFIG_FILE_NAME = ".snipsnap.json";

const DEFAULT_TEMPLATE_IGNORE_FILES = [DEFAULT_CONFIG_FILE_NAME, ".DS_Store"];

module.exports = {
  COMMANDS,
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_CONFIG_FILE_NAME,
  DEFAULT_TEMPLATE_IGNORE_FILES,
};
