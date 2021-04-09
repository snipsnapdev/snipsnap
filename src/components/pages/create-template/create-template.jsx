import { useRouter } from 'next/router';

import { gql, useGqlClient } from 'api/graphql';
import TemplateForm from 'components/shared/template-form';

const createTemplateQuery = gql`
  mutation createTemplate(
    $name: String!
    $prompts: jsonb!
    $files: jsonb!
    $templateGroupId: uuid
  ) {
    insert_templates_one(
      object: { name: $name, files: $files, prompts: $prompts, template_group_id: $templateGroupId }
    ) {
      name
      owner_id
      files
      prompts
      id
    }
  }
`;

const defaultTemplateValues = {
  name: '',
  prompts: [],
  files: [],
};

const CreateTemplate = () => {
  const gqlClient = useGqlClient();

  const router = useRouter();

  const { groupId } = router.query;

  const handleSave = async ({ name, prompts, files, templateGroupId }) => {
    const res = await gqlClient.request(createTemplateQuery, {
      name,
      prompts,
      files,
      ...(templateGroupId ? { templateGroupId } : {}),
    });

    try {
      const templateId = res?.insert_templates_one?.id || null;

      if (templateId) {
        router.push(`/template/${templateId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <TemplateForm
      initialValues={{ ...defaultTemplateValues, groupId }}
      isCreatingNewTemplate
      onSave={handleSave}
    />
  );
};

export default CreateTemplate;
