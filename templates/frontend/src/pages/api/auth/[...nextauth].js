import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import { adminGQLClient, gql } from 'api/graphql';
import UserModel from 'db/models/user';
import jwt from 'utils/jwt';

const { DATABASE_URL } = process.env;

const createAPIKey = gql`
  mutation createAPIKey($apiKey: String!, $userId: uuid!) {
    insert_api_keys_one(object: { api_key: $apiKey, user_id: $userId }) {
      api_key
    }
  }
`;

const updateUserEmail = gql`
  mutation($userId: uuid!, $email: String!) {
    update_users(_set: { email: $email }, where: { user_id: { _eq: $userId } }) {
      returning {
        user_id
        email
      }
    }
  }
`;

const options = {
  // TODO Create branded pages for autogenerated pages
  pages: {
    signIn: '/login',
  },

  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  session: {
    maxAge: 90 * 24 * 60 * 60, // 90 days
  },

  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    DATABASE_URL,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        User: UserModel,
      },
    }
  ),

  callbacks: {
    async session(session, user) {
      session.user.id = user.userId;
      return session;
    },
    // },
    // async signin(profile, account, metadata) {
    //   // https://developer.github.com/v3/users/emails/#list-email-addresses-for-the-authenticated-user
    //   const res = await fetch('https://api.github.com/user/emails', {
    //     headers: {
    //       Authorization: `token ${account.accessToken}`,
    //     },
    //   });
    //   const emails = await res.json();
    //   if (!emails || emails.length === 0) {
    //     return;
    //   }

    //   console.log('fetched emails', emails);
    //   // Sort by primary email - the user may have several emails, but only one of them will be primary
    //   const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
    //   profile.email = sortedEmails[0].email;
    // },
  },

  events: {
    async createUser({ userId, account }) {
      const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
      const token = jwt.encode(userId, ONE_YEAR_IN_SECONDS, 'user_api');
      try {
        await adminGQLClient().request(createAPIKey, { apiKey: token, userId });
      } catch (error) {
        console.log('Failed to create api key', error);
      }
    },
    async signIn({ user, account }) {
      if (!user.email) {
        // fetch user email
        const res = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${account.accessToken}`,
          },
        });
        const emails = await res.json();
        if (!emails || emails.length === 0) {
          return;
        }

        // Sort by primary email - the user may have several emails, but only one of them will be primary
        const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
        const primaryEmail = sortedEmails[0].email;

        try {
          await adminGQLClient().request(updateUserEmail, {
            userId: user.userId,
            email: primaryEmail,
          });
        } catch (error) {
          console.log('Failed to set email', error);
        }
      }
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
