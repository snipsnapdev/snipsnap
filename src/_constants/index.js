const vscode = require('vscode')

const COMMANDS = {
  RUN_EXTENSION: "templator.runTemplator"
}

const DEFAULT_TEMPLATES_FOLDER_PATH = `${vscode.workspace.workspaceFolders[0].uri.path}/.vscode/snipsnap/templates`;

const DEFAULT_PROMPTS_FILENAME = 'prompts.snipsnap.json'

module.exports = {
  COMMANDS,
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_PROMPTS_FILENAME
}