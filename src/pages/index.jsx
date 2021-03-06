import Head from 'next/head';

import Home from 'components/pages/home';
import Layout from 'components/shared/layout';
import generatePageTitle from 'utils/generate-page-title';
import withAuth from 'utils/with-auth';

const HomePage = () => (
  <Layout>
    <Head>
      <title>{generatePageTitle()}</title>
    </Head>
    <Home />
  </Layout>
);

export async function getServerSideProps(context) {
  const data = await withAuth(context);
  return data;
}

export default HomePage;
