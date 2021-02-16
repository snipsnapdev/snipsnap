const vscode = require("vscode");
const Mustache = require("mustache");
const {
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_TEMPLATE_FOLDER_NAME,
  DEFAULT_CONFIG_FILE_NAME,
} = require("../_constants");

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
      // @TODO: this is the place where we should pick
      // prompts file and iteratively ask user for every variable in it
      // building a tag map that we will load up in Mustache during copy
      // ==
      // set variableName in case of dismissal,
      // use getDefaultPromptMessage in case message is absent
      vscode.window
        .showQuickPick(folderNames, quickPickOptions)
        .then(async (templateName) => {
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

          const newFolderURI = vscode.Uri.file(
            `${folderURI.path}/${newFolderName}`
          );

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

          // @TODO: support nested structure
          // @TODO: omit prompts file
          vscode.workspace.fs.readDirectory(templateURI).then((files) => {
            const fileNames = files.map((file) => file[0]);
            const processedFileNames = fileNames.map((fileName) =>
              Mustache.render(fileName, promptResults)
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
};

module.exports = runTemplator;
