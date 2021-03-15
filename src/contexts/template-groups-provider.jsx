import React, { useContext } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

export const TemplateGroupsContext = React.createContext(null);

export const useTemplateGroups = () => useContext(TemplateGroupsContext);

const query = gql`
  query getOwnedTemplateGroups {
    templates(where: { template_group_id: { _is_null: true } }) {
      id
      name
    }
    template_groups {
      id
      name
      templates {
        name
        id
        prompts
        files
      }
    }
  }
`;

export default function TemplateGroupsProvider({ children }) {
  const gqlClient = useGqlClient();
  const fetcher = () => gqlClient.request(query);
  const { data } = useSWR('getOwnedTemplateGroups', fetcher);
  const groups = data?.template_groups || [];
  const templates = data?.templates || [];

  return (
    <TemplateGroupsContext.Provider value={{ groups, templates }}>
      {children}
    </TemplateGroupsContext.Provider>
  );
}
