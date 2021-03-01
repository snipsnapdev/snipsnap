const vscode = require("vscode");
const { runExtension } = require("./commands");
const { COMMANDS } = require("./_constants");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    COMMANDS.RUN_EXTENSION,
    runExtension
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
