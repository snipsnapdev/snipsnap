const vscode = require("vscode");
const Handlebars = require("handlebars");
const camelCase = require("lodash.camelcase");
const snakeCase = require("lodash.snakecase");
const kebabCase = require("lodash.kebabcase");
const upperCase = require("lodash.uppercase");
const lowerCase = require("lodash.lowercase");
const startCase = require("lodash.startcase");
const { gqlClient, gql } = require("../api");
const {
  DEFAULT_TEMPLATES_FOLDER_PATH,
  DEFAULT_CONFIG_FILE_NAME,
} = require("../_constants");
const {
  getLocalDirStructure,
  getRemoteDirStructure,
  buildDirStructure,
} = require("../utils");

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

function fetchRemoteTemplates(token) {
  const getTemplates = gql`
    query {
      templates {
        id
        name
        prompts
        files
      }
    }
  `;

  return gqlClient(token).request(getTemplates);
}

async function runExtension(folderURI) {
  const defaultTemplatesFolderURI = vscode.Uri.file(
    DEFAULT_TEMPLATES_FOLDER_PATH
  );

  const token = vscode.workspace
    .getConfiguration("snipsnap-templates")
    .get("token");

  let remoteTemplates = [];

  if (token) {
    try {
      const { templates } = await fetchRemoteTemplates(token);
      remoteTemplates = templates;
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  }

  const remoteTemplateNames = remoteTemplates.map(({ name }) => name);

  async function createFromLocalTemplate(templateName) {
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

    const structure = await getLocalDirStructure({
      path: folderURI.path,
      dirURI: templateURI,
      onNameCopy: (name) => Handlebars.compile(name)(promptResults),
      onContentCopy: (content) => Handlebars.compile(content)(promptResults),
    });

    buildDirStructure(structure);
  }

  async function createFromRemoteTemplate(templateName) {
    const { prompts, files } = remoteTemplates.find(
      ({ name }) => name === templateName
    );

    const promptResults = {};

    if (prompts && prompts.length > 0) {
      for (let i = 0; i < prompts.length; i++) {
        const promptResult = await vscode.window.showInputBox({
          prompt: prompts[i].message,
        });

        promptResults[prompts[i].variable] = promptResult;
      }
    }

    const structure = await getRemoteDirStructure({
      path: folderURI.path,
      files,
      onNameCopy: (name) => Handlebars.compile(name)(promptResults),
      onContentCopy: (content) => Handlebars.compile(content)(promptResults),
    });

    buildDirStructure(structure);
  }

  vscode.workspace.fs.readDirectory(defaultTemplatesFolderURI).then(
    (files) => {
      const localTemplates = files.filter(
        (file) => file[1] === vscode.FileType.Directory
      );
      const localTemplateNames = localTemplates.map((template) => template[0]);

      const folderNames = [...localTemplateNames, ...remoteTemplateNames];

      function createFromTemplate(templateName) {
        const isLocalTemplate = localTemplateNames.find(
          (localTemplateName) => localTemplateName === templateName
        );

        if (isLocalTemplate) {
          createFromLocalTemplate(templateName);
        } else {
          createFromRemoteTemplate(templateName);
        }
      }

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
}

module.exports = runExtension;
