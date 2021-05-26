require("dotenv").config();
const { GraphQLClient } = require("graphql-request");
const gqlClient = new GraphQLClient(process.env.HASURA_GRAPHQL_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
});

module.exports = { gqlClient };
