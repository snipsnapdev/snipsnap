import Head from 'next/head';

import CreateTemplate from 'components/pages/create-template';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const CreateTemplatePage = () => (
  <Layout>
    <Head>
      <title>{generatePageTitle('Create Template')}</title>
    </Head>
    <CreateTemplate />
  </Layout>
);

export async function getServerSideProps(context) {
  const data = await withAuth(context);
  return data;
}

export default CreateTemplatePage;
