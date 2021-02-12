// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const DEFAULT_TEMPLATES_FOLDER = ".vscode/snipsnap/templates";

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "templator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "templator.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello from templator!");
    }
  );

  let disposable1 = vscode.commands.registerCommand(
    "templator.runTemplator",
    function (folderURI) {
      vscode.window.showInformationMessage("Running templator!");

      const defaultTemplatesFolderURI = vscode.Uri.file(
        `${vscode.workspace.rootPath}/${DEFAULT_TEMPLATES_FOLDER}`
      );

      vscode.workspace.fs.readDirectory(defaultTemplatesFolderURI).then(
        (files) => {
          const folders = files.filter(
            (file) => file[1] === vscode.FileType.Directory
          );
          const folderNames = folders.map((folder) => folder[0]);

          const quickPickOptions = {
            placeHolder: "Please choose a template you want to use",
          };

          vscode.window
            .showQuickPick(folderNames, quickPickOptions)
            .then(async (templateName) => {
              if (!templateName) return;

              const customFileName = await vscode.window.showInputBox({
                prompt: "Enter file name",
                placeHolder: `Default file name is "${templateName}"`,
              });

              // If user pressed ESC, then return
              if (typeof customFileName === "undefined") return;

              const fileNameToUse = customFileName || templateName;

              const newFolderURI = vscode.Uri.file(
                `${folderURI.path}/${fileNameToUse}`
              );
              const templateURI = vscode.Uri.file(
                `${defaultTemplatesFolderURI.path}/${templateName}`
              );

              vscode.workspace.fs.readDirectory(templateURI).then((files) => {
                const fileNames = files.map((file) => file[0]);
                const processedFileNames = fileNames.map((fileName) =>
                  fileName.replace("${fileName}", fileNameToUse)
                );

                processedFileNames.forEach((fileName, fileNameIndex) => {
                  const fileURI = vscode.Uri.file(
                    `${templateURI.path}/${fileNames[fileNameIndex]}`
                  );
                  const newFileURI = vscode.Uri.file(
                    `${newFolderURI.path}/${fileName}`
                  );

                  vscode.workspace.fs.copy(fileURI, newFileURI);
                });
              });
            });
        },
        (error) => {
          vscode.window.showErrorMessage(error.message);
        }
      );
    }
  );

  context.subscriptions.push(disposable, disposable1);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
