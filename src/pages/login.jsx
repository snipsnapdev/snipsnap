import Login from 'components/pages/login';
import { useSession } from 'next-auth/client';

const LoginPage = () => {
  const [session, loading] = useSession();
  return <Login />;
};

export default LoginPage;
