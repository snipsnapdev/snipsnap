import React, { useContext } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';

export const TemplateGroupsContext = React.createContext(null);

export const useTemplateGroups = () => useContext(TemplateGroupsContext);

const query = gql`
  query getOwnedTemplateGroups {
    user_available_template_groups {
      template_group {
        id
        name
        owner_id
        templates {
          id
          files
          name
          prompts
          owner_id
        }
      }
    }
    user_available_templates(where: { template: { template_group_id: { _is_null: true } } }) {
      template {
        id
        name
        prompts
        files
        owner_id
      }
    }
  }
`;

export default function TemplateGroupsProvider({ children }) {
  const gqlClient = useGqlClient();
  const fetcher = () => gqlClient.request(query);
  const { data } = useSWR('getOwnedTemplateGroups', fetcher);
  const groups = (data?.user_available_template_groups || []).map((item) => item.template_group);
  const templates = (data?.user_available_templates || []).map((item) => item.template);

  return (
    <TemplateGroupsContext.Provider value={{ groups, templates }}>
      {children}
    </TemplateGroupsContext.Provider>
  );
}
