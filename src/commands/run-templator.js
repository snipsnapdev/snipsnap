const vscode = require('vscode');
const { DEFAULT_TEMPLATES_FOLDER_PATH } = require('../_constants');
const Mustache = require('mustache');

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

          const customFileName = await vscode.window.showInputBox({
            prompt: "Enter file name",
            placeHolder: `Default file name is "${templateName}"`,
          });

          // If user pressed ESC, then return
          if (typeof customFileName === "undefined") return;

          const fileNameToUse = {
            fileName: customFileName || templateName
          }

          const newFolderURI = vscode.Uri.file(
            `${folderURI.path}/${fileNameToUse.fileName}`
            
          );
          const templateURI = vscode.Uri.file(
            `${defaultTemplatesFolderURI.path}/${templateName}`
          );

          // @TODO: support nested structure
          // @TODO: omit prompts file
          vscode.workspace.fs.readDirectory(templateURI).then((files) => {
            const fileNames = files.map((file) => file[0]);
            const processedFileNames = fileNames.map((fileName) =>
              Mustache.render(fileName, fileNameToUse)
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

module.exports = runTemplator