import Head from 'next/head';

import Marketplace from 'components/pages/marketplace';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const MarketplacePage = () => (
  <Layout>
    <Head>
      <title>{generatePageTitle('Marketplace')}</title>
    </Head>
    <Marketplace />
  </Layout>
);

export async function getServerSideProps(context) {
  const data = await withAuth(context, true);
  return data;
}

export default MarketplacePage;
