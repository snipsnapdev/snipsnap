require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const { typeDefs } = require("./type-defs");

const { encode } = require("./utils/jwt");
const { gqlClient } = require("./api/client");

const {
  createTemplate,
  updateTemplate,
  shareTemplateGroup,
  shareTemplate,
  unshareTemplate,
  unshareTemplateFromCurrentUser,
  unshareTemplateGroup,
  unshareTemplateGroupFromCurrentUser,
} = require("./template");

const { getUserByEmail } = require("./utils/helpers");

const resolvers = {
  Mutation: {
    refresh_api_token: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation ($user_id: uuid!, $newToken: String!) {
          update_api_keys(
            _set: { api_key: $newToken }
            where: { user_id: { _eq: $user_id } }
          ) {
            returning {
              api_key
            }
          }
        }
      `;

      const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
      const newToken = encode(userId, ONE_YEAR_IN_SECONDS, "user_api");

      const res = await gqlClient.request(mutation, {
        newToken,
        user_id: userId,
      });

      return res?.update_api_keys?.returning?.[0];
    },
    insert_template: createTemplate,
    update_template: updateTemplate,
    share_template: shareTemplate,
    unshare_template: unshareTemplate,
    unshare_template_from_current_user: unshareTemplateFromCurrentUser,
    share_template_group: shareTemplateGroup,
    unshare_template_group: unshareTemplateGroup,
    unshare_template_group_from_current_user:
      unshareTemplateGroupFromCurrentUser,
    add_event: async (_, args, { userId }) => {
      if (!userId) return;

      const addEventMutation = gql`
        mutation ($event: String!, $user_id: uuid, $metadata: String) {
          insert_stats_one(
            object: { event: $event, user_id: $user_id, metadata: $metadata }
          ) {
            event
            user_id
            timestamp
            metadata
          }
        }
      `;

      const { event, metadata } = args.object;

      const res = await gqlClient.request(addEventMutation, {
        event,
        metadata,
        user_id: userId,
      });

      return res?.insert_stats_one;
    },
  },
};

const context = ({ req }) => {
  return {
    userId: req.headers?.["x-hasura-user-id"],
  };
};

const server = new ApolloServer({
  // Enable introspection in dev and production since it's necessary for hasura
  introspection: true,
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
