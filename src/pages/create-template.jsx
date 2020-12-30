import CreateTemplate from 'components/pages/create-template';
import Layout from 'components/shared/layout';
import { useSession } from 'next-auth/client';

const CreateTemplatePage = () => {
  const [session, loading] = useSession();
  return (
    <Layout>
      <CreateTemplate />
    </Layout>
  );
};

export default CreateTemplatePage;
