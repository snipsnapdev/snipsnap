import { useSession } from 'next-auth/client';
import React, { useContext } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

export const TemplateGroupsContext = React.createContext(null);

export const useTemplateGroups = () => useContext(TemplateGroupsContext);

const query = gql`
  query getOwnedTemplatesGroups {
    templates_groups {
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
  const { data } = useSWR('getOwnedTemplatesGroups', fetcher);
  const groups = data?.templates_groups || [];
  console.log('groups data', data);

  return <TemplateGroupsContext.Provider value={groups}>{children}</TemplateGroupsContext.Provider>;
}
