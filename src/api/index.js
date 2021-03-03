const { gql, GraphQLClient } = require("graphql-request");

const gqlClient = (token) => {
  return new GraphQLClient("http://localhost:3010/v1/graphql", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

module.exports = { gqlClient, gql };
