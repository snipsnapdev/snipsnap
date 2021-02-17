const vscode = require("vscode");
const Mustache = require("mustache");
const {
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_TEMPLATE_FOLDER_NAME,
  DEFAULT_CONFIG_FILE_NAME,
} = require("../_constants");
const { getDirStructure, buildDirStructure } = require("../utils");

const runTemplator = (folderURI) => {
  const defaultTemplatesFolderURI = vscode.Uri.file(
    DEFAULT_TEMPLATES_FOLDER_PATH
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

      vscode.window.showQuickPick(folderNames, quickPickOptions).then(
        async (templateName) => {
          if (!templateName) return;

          const templateURI = vscode.Uri.file(
            `${defaultTemplatesFolderURI.path}/${templateName}/${DEFAULT_TEMPLATE_FOLDER_NAME}`
          );
          const templateConfigURI = vscode.Uri.file(
            `${defaultTemplatesFolderURI.path}/${templateName}/${DEFAULT_CONFIG_FILE_NAME}`
          );

          const newFolderNamePromptResult = await vscode.window.showInputBox({
            prompt: "Enter folder name",
            placeHolder: `Default folder name is "${templateName}"`,
          });

          const newFolderName = newFolderNamePromptResult || templateName;

          const templateConfigDocument = await vscode.workspace.openTextDocument(
            templateConfigURI
          );
          const templateConfigAsJSON = templateConfigDocument.getText();
          const templateConfig = JSON.parse(templateConfigAsJSON);

          const prompts = templateConfig.prompts;
          const promptResults = {};

          if (prompts && prompts.length > 0) {
            for (let i = 0; i < prompts.length; i++) {
              const promptResult = await vscode.window.showInputBox({
                prompt: prompts[i].message,
              });

              promptResults[prompts[i].variableName] = promptResult;
            }
          }

          const structure = await getDirStructure({
            path: newFolderName,
            dirURI: templateURI,
            onNameCopy: (name) => Mustache.render(name, promptResults),
            onContentCopy: (content) => Mustache.render(content, promptResults),
          });

          buildDirStructure(folderURI.path, structure);
        },
        (error) => {
          vscode.window.showErrorMessage(error.message);
        }
      );
    },
    (error) => {
      vscode.window.showErrorMessage(error.message);
    }
  );
};

module.exports = runTemplator;
