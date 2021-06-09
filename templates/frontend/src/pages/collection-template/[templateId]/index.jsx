import Head from 'next/head';
import { useRouter } from 'next/router';

import CollectionTemplate from 'components/pages/collection-template';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const CollectionTemplatePage = () => {
  const router = useRouter();
  const { templateId } = router.query;

  return (
    <Layout>
      <Head>
        <title>{generatePageTitle('View Collection Template')}</title>
      </Head>
      <CollectionTemplate templateId={templateId} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const data = await withAuth(context, true);
  return data;
}

export default CollectionTemplatePage;
