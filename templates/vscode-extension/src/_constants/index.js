const vscode = require("vscode");

const COMMANDS = {
  RUN_EXTENSION: "snipsnap-templates.runExtension",
};

const DEFAULT_CONFIG_FILE_NAME = ".snipsnap.json";

const DEFAULT_TEMPLATE_IGNORE_FILES = [DEFAULT_CONFIG_FILE_NAME, ".DS_Store"];

module.exports = {
  COMMANDS,
  DEFAULT_CONFIG_FILE_NAME,
  DEFAULT_TEMPLATE_IGNORE_FILES,
};
