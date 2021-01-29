import { getSession } from 'next-auth/client';
import Head from 'next/head';

import CreateTemplate from 'components/pages/create-template';
import Layout from 'components/shared/layout';
import withAuth from 'components/shared/with-auth';
import generatePageTitle from 'utils/generate-page-title';

const CreateTemplatePage = () => (
  <Layout>
    <Head>
      <title>{generatePageTitle('Create Template')}</title>
    </Head>
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
