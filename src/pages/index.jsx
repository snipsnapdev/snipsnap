import Home from 'components/home';
import Layout from 'components/shared/layout';
import { getSession } from 'next-auth/client';
import withAuth from 'components/shared/with-auth';

const HomePage = () => (
  <Layout>
    <Home />
  </Layout>
);

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default withAuth(HomePage);
