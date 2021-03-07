import { useSession } from 'next-auth/client';
import React, { useContext } from 'react';
import useSWR from 'swr';

import { gql, gqlClient } from 'api/graphql';

export const TemplateGroupsContext = React.createContext(null);

export const useTemplateGroups = () => useContext(TemplateGroupsContext);

const query = gql`
  query getOwnedTemplateGroups {
    template_groups {
      id
      name
      templates {
        name
        id
      }
    }
  }
`;

export default function TemplateGroupsProvider({ children }) {
  const [{ token }] = useSession();
  const client = gqlClient(token);
  const fetcher = () => client.request(query);
  const { data } = useSWR('getOwnedTemplateGroups', fetcher);
  const groups = data?.template_groups || [];

  return <TemplateGroupsContext.Provider value={groups}>{children}</TemplateGroupsContext.Provider>;
}