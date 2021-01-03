import { getSession } from 'next-auth/client';

import CreateTemplate from 'components/pages/create-template';
import Layout from 'components/shared/layout';
import withAuth from 'components/shared/with-auth';

const CreateTemplatePage = () => (
  <Layout>
    <CreateTemplate />
  </Layout>
);

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default withAuth(CreateTemplatePage);
