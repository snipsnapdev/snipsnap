import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
// Change it to default prisma adapter once it's fixed
// https://github.com/nextauthjs/next-auth/issues/683
import Adapter from 'db/prisma/prisma-next-auth-adapter';
import { PrismaClient } from '@prisma/client';
import jwt from 'utils/jwt';

const prisma = new PrismaClient();
const { JWT_SECRET } = process.env;
const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: Adapter({ prisma }),
  session: {
    jwt: true,
  },
  jwt: {
    secret: JWT_SECRET,
    encode: async ({ token, secret }) => {
      token['https://hasura.io/jwt/claims'] = {
        'x-hasura-allowed-roles': ['user'],
        'x-hasura-default-role': 'user',
        'x-hasura-role': 'user',
        'x-hasura-user-id': token.id,
      };
      return jwt.sign({ token, secret });
    },
  },
  callbacks: {
    session: async (session, user) => {
      const encodedToken = jwt.sign({ token: user, secret: JWT_SECRET });
      session.id = user.id;
      session.token = encodedToken;
      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      const isSignIn = !!user;
      if (isSignIn) {
        token.id = user.userId;
      }
      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
