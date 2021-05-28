import TemplateForm from 'components/shared/template-form';
import { useTemplateGroups } from 'contexts/template-groups-provider';

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
    files: template?.files ? JSON.parse(template.files) : [],
    groupId,
  };

  return <TemplateForm key={templateId} templateId={templateId} initialValues={templateData} />;
};

export default EditTemplate;
