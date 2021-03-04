import { gql, GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET;

const gqlClient = (token) =>
  new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const adminGQLClient = () =>
  new GraphQLClient(endpoint, {
    headers: {
      'x-hasura-admin-secret': hasuraAdminSecret,
    },
  });

export { gqlClient, adminGQLClient, gql };
