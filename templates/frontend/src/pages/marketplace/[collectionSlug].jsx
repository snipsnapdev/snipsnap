import Head from 'next/head';
import { useRouter } from 'next/router';

import Collection from 'components/pages/collection';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const CollectionPage = () => {
  const router = useRouter();
  const { collectionSlug } = router.query;

  return (
    <Layout>
      <Head>
        <title>{generatePageTitle('View Collection')}</title>
      </Head>
      <Collection collectionSlug={collectionSlug} />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const data = await withAuth(context, true);
  return data;
}

export default CollectionPage;
