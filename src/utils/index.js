const vscode = require("vscode");
const { TextEncoder } = require("util");
const { DEFAULT_CONFIG_FILE_NAME } = require("../_constants");

const getDefaultPromptMessage = (variableName) =>
  `Enter value for ${variableName}`;

const getDirStructure = async ({ path, dirURI, onNameCopy, onContentCopy }) => {
  const dirFiles = await vscode.workspace.fs.readDirectory(dirURI);

  return Promise.all(
    dirFiles
      .filter(([fileName]) => fileName !== DEFAULT_CONFIG_FILE_NAME)
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
