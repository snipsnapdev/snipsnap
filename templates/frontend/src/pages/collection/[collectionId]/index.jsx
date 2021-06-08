import Head from 'next/head';
import { useRouter } from 'next/router';

import Collection from 'components/pages/collection';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const ViewTemplatePage = () => {
  const router = useRouter();
  const { collectionId } = router.query;

  return (
    <Layout>
      <Head>
        <title>{generatePageTitle('View Collection')}</title>
      </Head>
      <Collection collectionId={collectionId} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const data = await withAuth(context);
  return data;
}

export default ViewTemplatePage;
