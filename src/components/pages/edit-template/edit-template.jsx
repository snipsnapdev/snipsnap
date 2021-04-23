import { gql, useGqlClient } from 'api/graphql';
import TemplateForm from 'components/shared/template-form';
import { useTemplateGroups } from 'contexts/template-groups-provider';
import { formatFilesDataFromApi } from 'utils/files-provider-helpers';

const editTemplateQuery = gql`
  mutation updateTemplate(
    $id: String!
    $name: String
    $prompts: String
    $files: String
    $templateGroupId: String
  ) {
    update_template(
      object: {
        id: $id
        name: $name
        prompts: $prompts
        files: $files
        template_group_id: $templateGroupId
      }
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

const findTemplateById = (templateId, groups, templates) => {
  let template = null;
  for (const group of groups) {
    template = group.templates.find((item) => item.id === templateId);
    if (typeof template !== 'undefined') {
      return template;
    }
  }

  template = templates.find((t) => t.id === templateId);
  return template;
};

const EditTemplate = ({ templateId }) => {
  const { groups, templates } = useTemplateGroups();

  const template = findTemplateById(templateId, groups, templates);

  const groupId =
    (template &&
      groups.find((group) => group.templates.map((t) => t.id).includes(template.id))?.id) ||
    null;

  const templateData = {
    name: template?.name || '',
    prompts: template?.prompts ? JSON.parse(template.prompts) : [],
    files: template?.files ? formatFilesDataFromApi(JSON.parse(template.files)) : [],
    groupId,
  };

  const gqlClient = useGqlClient();

  const handleSave = async ({ name, prompts, files, templateGroupId }) =>
    gqlClient.request(editTemplateQuery, {
      id: templateId,
      name,
      prompts,
      files,
      ...(templateGroupId ? { templateGroupId } : {}),
    });

  if (!template) {
    console.error('No template found with id=', templateId);
    return <></>;
  }

  return <TemplateForm key={templateId} initialValues={templateData} onSave={handleSave} />;
};

export default EditTemplate;
