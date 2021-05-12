import Head from 'next/head';

import Login from 'components/pages/login';
import generatePageTitle from 'utils/generate-page-title';

const LoginPage = () => (
  <>
    <Head>
      <title>{generatePageTitle('Login')}</title>
    </Head>
    <Login />
  </>
);
export default LoginPage;
