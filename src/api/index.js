const vscode = require("vscode");
const { gql, GraphQLClient } = require("graphql-request");

const defaultServer = vscode.workspace
  .getConfiguration("snipsnap-templates")
  .get("defaultServer");

const gqlClient = (token) => {
  return new GraphQLClient(`${defaultServer}/v1/graphql`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

module.exports = { gqlClient, gql };
