const vscode = require("vscode");
const { TextEncoder } = require("util");
const { DEFAULT_TEMPLATE_IGNORE_FILES } = require("../_constants");

const getDefaultPromptMessage = (variable) => `Enter value for ${variable}`;

const getLocalDirStructure = async ({
  path,
  dirURI,
  onNameCopy,
  onContentCopy,
}) => {
  const dirFiles = await vscode.workspace.fs.readDirectory(dirURI);

  return Promise.all(
    dirFiles
      .filter(([fileName]) => !DEFAULT_TEMPLATE_IGNORE_FILES.includes(fileName))
      .map(async ([fileName, fileType]) => {
        if (fileType === vscode.FileType.Directory) {
          return {
            filePath: onNameCopy(`${path}/${fileName}`),
            fileType,
            fileContent: await getLocalDirStructure({
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

const getRemoteDirStructure = async ({
  path,
  files,
  onNameCopy,
  onContentCopy,
}) => {
  return Promise.all(
    files
      .filter(
        ({ data: { name } }) => !DEFAULT_TEMPLATE_IGNORE_FILES.includes(name)
      )
      .map(async ({ type, data: { name, content, files } }) => {
        if (type === "folder") {
          return {
            filePath: onNameCopy(`${path}/${name}`),
            fileType: vscode.FileType.Directory,
            fileContent: await getRemoteDirStructure({
              path: onNameCopy(`${path}/${name}`),
              files,
              onNameCopy,
              onContentCopy,
            }),
          };
        }

        return {
          filePath: onNameCopy(path),
          fileName: onNameCopy(name),
          fileType: vscode.FileType.File,
          fileContent: onContentCopy(content),
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
  getLocalDirStructure,
  getRemoteDirStructure,
  buildDirStructure,
};
