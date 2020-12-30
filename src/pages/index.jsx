import Home from 'components/home';
import Layout from 'components/shared/layout';
import { useSession } from 'next-auth/client';

const HomePage = () => {
  const [session, loading] = useSession();
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default HomePage;
