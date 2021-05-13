import { useRouter } from 'next/router';

import { gql, useGqlClient } from 'api/graphql';
import TemplateForm from 'components/shared/template-form';

const createTemplateQuery = gql`
  mutation createTemplate(
    $name: String!
    $prompts: String
    $files: String!
    $templateGroupId: String
  ) {
    insert_template(
      object: { name: $name, files: $files, prompts: $prompts, template_group_id: $templateGroupId }
    ) {
      id
      name
      prompts
      files
      template_group_id
      owner_id
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

    const templateId = res?.insert_template?.id || null;

    if (templateId) {
      router.push(`/template/${templateId}`);
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
