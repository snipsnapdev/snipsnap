import { withSentry } from '@sentry/nextjs';
import { getSession } from 'next-auth/client';

import jwt from 'utils/jwt';

const MAX_AGE = process.env.JWT_API_MAX_AGE;
const {SENTRY_ENABLED} = process.env;

const refreshToken = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401);
  }
  const token = jwt.encode(session.user.id, MAX_AGE);
  res.json({ token });
};

const refresher = SENTRY_ENABLED === 'true' ? withSentry(refreshToken) : refreshToken;
export default refresher;
