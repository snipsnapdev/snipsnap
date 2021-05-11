import React, { useContext } from 'react';
import useSWR from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import useSession from 'hooks/use-session';

export const TemplateGroupsContext = React.createContext(null);

export const useTemplateGroups = () => useContext(TemplateGroupsContext);

const query = gql`
  query getOwnedTemplateGroups {
    user_available_template_groups {
      template_group {
        id
        name
        owner_id
      }
    }
    user_available_templates {
      template {
        id
        name
        prompts
        files
        owner_id
        template_group_id
      }
      favourite
    }
  }
`;

function sortTemplatesByName(template1, template2) {
  return template1.name >= template2.name ? 1 : -1;
}

export default function TemplateGroupsProvider({ children }) {
  const [session] = useSession();
  const gqlClient = useGqlClient();

  const fetcher = async () => {
    const res = await gqlClient.request(query);

    if (res.errors) {
      throw new Error('Failed to fetch available templates');
    }

    return res;
  };
  const { data, error } = useSWR('getOwnedTemplateGroups', fetcher, { revalidateOnFocus: false });

  if (error) {
    console.error(error);
  }

  // Session can be undefined
  const { user } = session || {};

  const templates = (data?.user_available_templates || []).map(({ template, favourite }) => ({
    ...template,
    favourite,
  }));

  const groups = (data?.user_available_template_groups || []).map(({ template_group: group }) => {
    group.templates = templates
      .filter(({ template_group_id }) => template_group_id === group.id)
      .sort(sortTemplatesByName);

    return group;
  });

  const templatesWithoutGroup = templates
    .filter(({ template_group_id }) => !template_group_id)
    .sort(sortTemplatesByName);

  const ownedGroups = groups.filter(({ owner_id }) => owner_id === user.id);
  const ownedTemplates = templatesWithoutGroup.filter(({ owner_id }) => owner_id === user.id);

  const sharedGroups = groups.filter(({ owner_id }) => owner_id !== user.id);
  const sharedTemplates = templatesWithoutGroup.filter(({ owner_id }) => owner_id !== user.id);

  const providerValue = {
    groups,
    templates: templatesWithoutGroup,
    ownedGroups,
    ownedTemplates,
    sharedGroups,
    sharedTemplates,
  };

  return (
    <TemplateGroupsContext.Provider value={providerValue}>
      {children}
    </TemplateGroupsContext.Provider>
  );
}
