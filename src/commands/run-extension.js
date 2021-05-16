const vscode = require("vscode");
const Handlebars = require("handlebars");
const camelCase = require("lodash.camelcase");
const snakeCase = require("lodash.snakecase");
const kebabCase = require("lodash.kebabcase");
const upperCase = require("lodash.uppercase");
const lowerCase = require("lodash.lowercase");
const startCase = require("lodash.startcase");
const { gqlClient, gql } = require("../api");
const { getRemoteDirStructure, buildDirStructure } = require("../utils");

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
      userAvailableTemplates: user_available_templates(
        order_by: { favourite: desc, template: { name: asc } }
      ) {
        template {
          name
          files
          prompts
        }
      }
    }
  `;

  return gqlClient(token).request(getTemplates);
}

async function runExtension(folderURI) {
  const token = vscode.workspace
    .getConfiguration("snipsnap-templates")
    .get("token");

  let remoteTemplates = [];

  if (token) {
    try {
      const { userAvailableTemplates } = await fetchRemoteTemplates(token);

      remoteTemplates = userAvailableTemplates.map((userAvailableTemplate) => {
        let template = userAvailableTemplate.template;
        template.files = JSON.parse(template.files);
        template.prompts = JSON.parse(template.prompts);
        return template;
      });
    } catch (error) {
      vscode.window.showErrorMessage(error.message);
    }
  } else {
    vscode.window.showErrorMessage(
      "Please set Snipsnap API token in the extension settings, you can get it from templates.snipsnap.dev"
    );
    return;
  }

  const remoteTemplateNames = remoteTemplates.map(({ name }) => name);

  async function createFromRemoteTemplate(templateName) {
    const { prompts, files } = remoteTemplates.find(
      ({ name }) => name === templateName
    );

    const promptResults = {};

    if (prompts && prompts.length > 0) {
      for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        const promptResult = await vscode.window.showInputBox({
          prompt: prompt.message,
        });

        promptResults[prompt.variableName] = promptResult;
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

  function createFromTemplate(templateName) {
    createFromRemoteTemplate(templateName);
  }

  if (remoteTemplateNames.length === 0) {
    vscode.window.showErrorMessage(
      `You don't have any templates yet. Please create at least one template in order to use extension`
    );
  } else if (remoteTemplateNames.length === 1) {
    createFromTemplate(remoteTemplateNames[0]);
  } else {
    const quickPickOptions = {
      placeHolder: "Please choose a template you want to use",
    };

    vscode.window
      .showQuickPick(remoteTemplateNames, quickPickOptions)
      .then(createFromTemplate, (error) => {
        vscode.window.showErrorMessage(error.message);
      });
  }
}

module.exports = runExtension;
