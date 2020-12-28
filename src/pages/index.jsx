import Home from 'components/home';
import { useSession } from 'next-auth/client';

const HomePage = () => {
  const [session, loading] = useSession();
  return <Home />;
};

export default HomePage;
