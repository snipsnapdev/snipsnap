import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';

import { gql, useGqlClient } from 'api/graphql';
import ViewOnlyTemplateForm from 'components/shared/template-form/view-only-form';

const cloneTemplateQuery = gql`
  mutation createTemplate($name: String!, $prompts: String, $files: String!) {
    insert_template(object: { name: $name, files: $files, prompts: $prompts }) {
      id
      name
      prompts
      files
      owner_id
    }
  }
`;

const getTemplateByIdQuery = gql`
  query getTemplate($templateId: uuid!) {
    templates(where: { id: { _eq: $templateId } }) {
      name
      prompts
      files
    }
  }
`;

const ViewTemplate = ({ templateId }) => {
  const gqlClient = useGqlClient();
  const [template, setTemplate] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!templateId) {
      return;
    }
    const fetchTemplate = async () => {
      try {
        const res = await gqlClient.request(getTemplateByIdQuery, { templateId });
        setTemplate(res?.templates?.[0] || null);
      } catch (error) {
        console.error('Fetching template failed', error);
      }
    };

    fetchTemplate();
  }, [templateId, gqlClient]);

  const templateData = {
    name: template?.name || '',
    prompts: template?.prompts ? JSON.parse(template.prompts) : [],
    files: template?.files ? JSON.parse(template.files) : [],
  };

  const handleSave = async () => {
    if (!template) {
      return;
    }
    try {
      const res = await gqlClient.request(cloneTemplateQuery, {
        ...template,
      });

      mutate('getOwnedTemplateGroups');

      const templateId = res?.insert_template?.id || null;

      if (templateId) {
        router.push(`/templates/${templateId}/edit`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!template) {
    return <></>;
  }

  return <ViewOnlyTemplateForm key={templateId} initialValues={templateData} onSave={handleSave} />;
};

export default ViewTemplate;
