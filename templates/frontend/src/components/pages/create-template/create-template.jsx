import { useRouter } from 'next/router';

import TemplateForm from 'components/shared/template-form';

const defaultTemplateValues = {
  name: '',
  prompts: [],
  files: [],
};

const CreateTemplate = () => {
  const router = useRouter();

  const { groupId } = router.query;

  return (
    <TemplateForm initialValues={{ ...defaultTemplateValues, groupId }} isCreatingNewTemplate />
  );
};

export default CreateTemplate;
