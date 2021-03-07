import { gql, useGqlClient } from 'api/graphql';
import TemplateForm from 'components/shared/template-form';

const createTemplateQuery = gql`
  mutation createTemplate(
    $name: String!
    $prompts: jsonb!
    $files: jsonb!
    $templateGroupId: uuid!
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

const CreateTemplate = () => {
  const gqlClient = useGqlClient();

  const handleSave = async ({ name, prompts, files, templateGroupId }) =>
    gqlClient.request(createTemplateQuery, {
      name,
      prompts,
      files,
      templateGroupId,
    });
  return <TemplateForm isCreatingNewTemplate onSave={handleSave} />;
};

export default CreateTemplate;
