const vscode = require("vscode");
const Handlebars = require("handlebars");
const camelCase = require("lodash.camelcase");
const snakeCase = require("lodash.snakecase");
const kebabCase = require("lodash.kebabcase");
const upperCase = require("lodash.uppercase");
const lowerCase = require("lodash.lowercase");
const startCase = require("lodash.startcase");
const {
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_CONFIG_FILE_NAME,
} = require("../_constants");
const { getDirStructure, buildDirStructure } = require("../utils");

Handlebars.registerHelper("toCamelCase", function (string) {
  return camelCase(string);
});

Handlebars.registerHelper("toSnakeCase", function (string) {
  return snakeCase(string);
});

Handlebars.registerHelper("toKebabCase", function (string) {
  return kebabCase(string);
});

Handlebars.registerHelper("toUpperCase", function (string) {
  return upperCase(string);
});

Handlebars.registerHelper("toLowerCase", function (string) {
  return lowerCase(string);
});

Handlebars.registerHelper("toPascalCase", function (string) {
  return startCase(camelCase(string)).replace(/ /g, "");
});

const runExtension = (folderURI) => {
  const defaultTemplatesFolderURI = vscode.Uri.file(
    DEFAULT_TEMPLATES_FOLDER_PATH
  );

  async function createFromTemplate(templateName) {
    if (!templateName) return;

    const templateURI = vscode.Uri.file(
      `${defaultTemplatesFolderURI.path}/${templateName}`
    );
    const templateConfigURI = vscode.Uri.file(
      `${defaultTemplatesFolderURI.path}/${templateName}/${DEFAULT_CONFIG_FILE_NAME}`
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

        promptResults[prompts[i].variable] = promptResult;
      }
    }

    const structure = await getDirStructure({
      path: folderURI.path,
      dirURI: templateURI,
      onNameCopy: (name) => Handlebars.compile(name)(promptResults),
      onContentCopy: (content) => Handlebars.compile(content)(promptResults),
    });

    buildDirStructure(structure);
  }

  vscode.workspace.fs.readDirectory(defaultTemplatesFolderURI).then(
    (files) => {
      const folders = files.filter(
        (file) => file[1] === vscode.FileType.Directory
      );
      const folderNames = folders.map((folder) => folder[0]);

      if (folderNames.length === 0) {
        vscode.window.showErrorMessage(
          `You don't have any templates yet. Please create at least one template in order to use extension`
        );
      } else if (folderNames.length === 1) {
        createFromTemplate(folderNames[0]);
      } else {
        const quickPickOptions = {
          placeHolder: "Please choose a template you want to use",
        };

        vscode.window
          .showQuickPick(folderNames, quickPickOptions)
          .then(createFromTemplate, (error) => {
            vscode.window.showErrorMessage(error.message);
          });
      }
    },
    (error) => {
      vscode.window.showErrorMessage(error.message);
    }
  );
};

module.exports = runExtension;
