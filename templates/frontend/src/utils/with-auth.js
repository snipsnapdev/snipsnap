import { getSession } from 'next-auth/client';

import generateToken from './generate-token';

const withAuth = async (context) => {
  const session = await getSession(context);

  if (session) {
    const token = generateToken(session);
    return {
      props: { session, token },
    };
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
};

export default withAuth;
