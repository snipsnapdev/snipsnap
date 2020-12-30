import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function withAuth(Component) {
  const ProtectedByAuthComponent = (props) => {
    const router = useRouter();
    const [session, loading] = useSession();

    if (loading) return null;

    if (!loading && !session) {
      router.push('/login');
      return null;
    }
    return <Component {...props} />;
  };

  return ProtectedByAuthComponent;
}
