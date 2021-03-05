import { gql, GraphQLClient } from 'graphql-request';
import React from 'react';

import { fetchToken, isExpired, useToken } from 'hooks/use-token';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL;
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET;

let client;
const getQlClient = () => {
  if (!client) {
    client = new GraphQLClient(endpoint);
  }
  return client;
};

export const useGqlClient = () => {
  const { token, setToken } = useToken();

  const client = getQlClient();
  client.setHeader('Authorization', `Bearer ${token}`);

  const originalRequest = client.request;
  client.request = async (...args) => {
    if (isExpired(token)) {
      const newToken = await fetchToken();
      setToken(newToken);
      client.setHeader('Authorization', `Bearer ${newToken}`);
    }
    return originalRequest.call(client, ...args);
  };

  return client;
};

const gqlClient = (token) => {
  const client = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const originalRequest = client.request;
  client.request = async (...args) => originalRequest(...args);

  return client;
};

const adminGQLClient = () =>
  new GraphQLClient(endpoint, {
    headers: {
      'x-hasura-admin-secret': hasuraAdminSecret,
    },
  });

export { gqlClient, adminGQLClient, gql };
