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

const BuildEntity = async (entity) => {
  if (!entity) return Promise.resolve(true);

  const { fileType, fileName, fileContent, filePath } = entity;
  let writeFlag = false;
  if (fileType === vscode.FileType.Directory) {
    await buildDirStructure(fileContent);
  } else {
    const fullPath = vscode.Uri.file(`${filePath}/${fileName}`)
    try {
      await vscode.workspace.fs.readFile(fullPath)
      const answers = {
        yes: "Rewrite",
        no: "Keep it"
      }
      const answer = await vscode.window.showInformationMessage(
        `File ${fullPath} already exists`,
        ...Object.values(answers)
      )
      writeFlag = answer === answers.yes
    } catch (_err) {
      // Do we know a better way to ensure file doesn't exist
      // but raising exception while reading the file?
      writeFlag  = true 
    }
    if(writeFlag) {
      await vscode.workspace.fs.writeFile(
        fullPath,
        new TextEncoder().encode(fileContent)
      );
    }
    return Promise.resolve(true)
  }
}

const buildDirStructure = async (structure) => {
  let it = 0
  while(it < structure.length) {
    await BuildEntity(structure[it])
    it += 1
  }
  return Promise.resolve(true)
};

module.exports = {
  getDefaultPromptMessage,
  getLocalDirStructure,
  getRemoteDirStructure,
  buildDirStructure,
};
