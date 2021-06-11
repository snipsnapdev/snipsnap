import Head from 'next/head';
import { useRouter } from 'next/router';

import ViewTemplate from 'components/pages/view-template';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const ViewTemplatePage = () => {
  const router = useRouter();
  const { templateId } = router.query;

  return (
    <Layout>
      <Head>
        <title>{generatePageTitle('View Template')}</title>
      </Head>
      <ViewTemplate templateId={templateId} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const data = await withAuth(context, true);
  return data;
}

export default ViewTemplatePage;
