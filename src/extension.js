const vscode = require("vscode");
const { runTemplator } = require("./commands");
const { COMMANDS } = require("./_constants");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    COMMANDS.RUN_EXTENSION,
    runTemplator
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
