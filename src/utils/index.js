const vscode = require("vscode");
const { TextEncoder } = require("util");
const { DEFAULT_TEMPLATE_IGNORE_FILES } = require("../_constants");

const getDefaultPromptMessage = (variable) => `Enter value for ${variable}`;

const getDirStructure = async ({ path, dirURI, onNameCopy, onContentCopy }) => {
  const dirFiles = await vscode.workspace.fs.readDirectory(dirURI);

  return Promise.all(
    dirFiles
      .filter(([fileName]) => !DEFAULT_TEMPLATE_IGNORE_FILES.includes(fileName))
      .map(async ([fileName, fileType]) => {
        if (fileType === vscode.FileType.Directory) {
          return {
            filePath: onNameCopy(`${path}/${fileName}`),
            fileType,
            fileContent: await getDirStructure({
              path: onNameCopy(`${path}/${fileName}`),
              dirURI: vscode.Uri.file(`${dirURI.path}/${fileName}`),
              onNameCopy,
              onContentCopy,
            }),
          };
        }

        const filePath = vscode.Uri.file(`${dirURI.path}/${fileName}`);
        const fileContent = await vscode.workspace.openTextDocument(filePath);

        return {
          filePath: onNameCopy(path),
          fileName: onNameCopy(fileName),
          fileType,
          fileContent: onContentCopy(fileContent.getText()),
        };
      })
  );
};

const buildDirStructure = async (structure) => {
  structure.forEach((entity) => {
    if (!entity) return;

    const { fileType, fileName, fileContent, filePath } = entity;

    if (fileType === vscode.FileType.Directory) {
      buildDirStructure(fileContent);
    } else {
      vscode.workspace.fs.writeFile(
        vscode.Uri.file(`${filePath}/${fileName}`),
        new TextEncoder().encode(fileContent)
      );
    }
  });
};

module.exports = {
  getDefaultPromptMessage,
  getDirStructure,
  buildDirStructure,
};
