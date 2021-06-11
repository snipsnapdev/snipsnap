import { gql, GraphQLClient } from 'graphql-request';

import { fetchToken, isExpired, useToken } from 'hooks/use-token';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET;

let client;
let originalRequest = null;
const getQlClient = () => {
  if (!client) {
    client = new GraphQLClient(endpoint);
    originalRequest = client.request;
  }
  return client;
};

const useGqlClient = () => {
  const { token, setToken } = useToken();

  const client = getQlClient();

  if (!token) return client;

  client.setHeader('Authorization', `Bearer ${token}`);

  client.request = async (...args) => {
    if (isExpired(token)) {
      try {
        const newToken = await fetchToken();
        setToken(newToken);
        client.setHeader('Authorization', `Bearer ${newToken}`);
      } catch (error) {
        throw new Error(`updating token failed: ${error}`);
      }
    }
    return originalRequest.call(client, ...args);
  };

  return client;
};

const adminGQLClient = () =>
  new GraphQLClient(endpoint, {
    headers: {
      'x-hasura-admin-secret': hasuraAdminSecret,
    },
  });

export { useGqlClient, adminGQLClient, gql };
