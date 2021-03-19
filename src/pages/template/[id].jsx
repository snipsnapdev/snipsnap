import Head from 'next/head';
import { useRouter } from 'next/router';

import EditTemplate from 'components/pages/edit-template';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const EditTemplatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <Head>
        <title>{generatePageTitle('Edit Template')}</title>
      </Head>
      <EditTemplate templateId={id} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const data = await withAuth(context);
  return data;
}

export default EditTemplatePage;
