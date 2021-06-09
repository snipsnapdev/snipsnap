require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const { typeDefs } = require("./type-defs");

const { encode } = require("./utils/jwt");
const { gqlClient } = require("./api/client");

const {
  createTemplate,
  updateTemplate,
  shareTemplateGroup,
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
    share_template: async (_, args, { userId }) => {
      const { template_id, share_by_user_id } = args.object;

      if (!userId && !share_by_user_id) return;

      let shareToUserId = null;

      try {
        shareToUserId = await getUserByEmail(args.object.share_to_user_email);
      } catch (err) {
        throw new Error(err.message);
      }

      // Can't share with yourself
      if (shareToUserId === userId) {
        throw new Error("Can't share with yourself");
      }

      const query = gql`
        query ($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
          shared_templates(
            where: {
              _and: [
                { template_id: { _eq: $template_id } }
                { shared_by_user_id: { _eq: $user_by } }
                { shared_to_user_id: { _eq: $user_to } }
              ]
            }
          ) {
            id
            template_id
            shared_by_user_id
            shared_to_user_id
            created_at
            updated_at
          }
        }
      `;

      const queryData = await gqlClient.request(query, {
        template_id: template_id,
        user_by: userId || share_by_user_id,
        user_to: shareToUserId,
      });

      // If template is already shared then we do not need to share it again
      if (queryData?.shared_templates?.length > 0) return;

      const mutation = gql`
        mutation ($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
          insert_shared_templates_one(
            object: {
              template_id: $template_id
              shared_by_user_id: $user_by
              shared_to_user_id: $user_to
            }
          ) {
            id
            template_id
            shared_by_user_id
            shared_to_user_id
            created_at
            updated_at
          }
        }
      `;

      const mutationData = await gqlClient.request(mutation, {
        template_id: template_id,
        user_by: userId || share_by_user_id,
        user_to: shareToUserId,
      });

      return mutationData?.insert_shared_templates_one || null;
    },
    unshare_template: async (_, args, { userId }) => {
      const { share_by_user_id } = args.object;

      if (!userId && !share_by_user_id) return;

      const shareToUserId = await getUserByEmail(
        args.object.share_to_user_email
      );

      // can't unshare with yourself
      if (userId === shareToUserId) {
        return;
      }

      const mutation = gql`
        mutation ($template_id: uuid!, $user_by: uuid, $user_to: uuid!) {
          delete_shared_templates(
            where: {
              template_id: { _eq: $template_id }
              shared_by_user_id: { _eq: $user_by }
              shared_to_user_id: { _eq: $user_to }
            }
          ) {
            returning {
              id
              template_id
              shared_by_user_id
              shared_to_user_id
              created_at
              updated_at
            }
          }
        }
      `;

      const { template_id } = args.object;

      const data = await gqlClient.request(mutation, {
        template_id: template_id,
        user_to: shareToUserId,
        user_by: userId || share_by_user_id,
      });

      return data?.delete_shared_templates?.returning?.[0] || null;
    },
    unshare_template_from_current_user: async (_, args, { userId }) => {
      const { share_to_user_email, template_id } = args.object;

      let shareToUserId;
      if (!userId) {
        shareToUserId = await getUserByEmail(share_to_user_email);
      }

      if (!userId && !shareToUserId) {
        return;
      }

      const mutation = gql`
        mutation ($template_id: uuid!, $user_to: uuid!) {
          delete_shared_templates(
            where: {
              template_id: { _eq: $template_id }
              shared_to_user_id: { _eq: $user_to }
            }
          ) {
            returning {
              id
              template_id
              shared_by_user_id
              shared_to_user_id
              created_at
              updated_at
            }
          }
        }
      `;

      const data = await gqlClient.request(mutation, {
        template_id: template_id,
        user_to: userId || shareToUserId,
      });

      return data?.delete_shared_templates?.returning?.[0] || null;
    },
    share_template_group: shareTemplateGroup,
    unshare_template_group: async (_, args, { userId }) => {
      if (!userId) return;

      const shareToUserId = await getUserByEmail(
        args.object.share_to_user_email
      );

      // Can't unshare from yourself. Yes, even if we let unshare mutation run, it won't delete anything since such item does not exist but still
      if (shareToUserId === userId) return;

      const mutation = gql`
        mutation ($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
          delete_shared_template_groups(
            where: {
              template_group_id: { _eq: $template_group_id }
              shared_by_user_id: { _eq: $user_by }
              shared_to_user_id: { _eq: $user_to }
            }
          ) {
            returning {
              id
              template_group_id
              shared_by_user_id
              shared_to_user_id
              created_at
              updated_at
            }
          }
        }
      `;

      const { template_group_id } = args.object;

      const data = await gqlClient.request(mutation, {
        template_group_id: template_group_id,
        user_by: userId,
        user_to: shareToUserId,
      });

      // unshare all templates in that group
      const getTemplatesInGroup = gql`
        query ($template_group_id: uuid!) {
          template_groups(where: { id: { _eq: $template_group_id } }) {
            templates {
              id
            }
          }
        }
      `;

      // find templates included in the unshared group
      const templates = await gqlClient.request(getTemplatesInGroup, {
        template_group_id,
      });

      const templateIds = templates?.template_groups?.[0].templates.map(
        (t) => t.id
      );

      const unshareTemplateQuery = gql`
        mutation shareTemplate(
          $templateId: String!
          $shareToUserEmail: String!
          $shareByUserId: String
        ) {
          unshare_template(
            object: {
              template_id: $templateId
              share_to_user_email: $shareToUserEmail
              share_by_user_id: $shareByUserId
            }
          ) {
            shared_to_user_id
          }
        }
      `;

      // unshare all templates with the user removed from group
      if (templateIds.length > 0) {
        await Promise.all(
          templateIds.map((templateId) =>
            gqlClient.request(unshareTemplateQuery, {
              templateId,
              shareToUserEmail: args.object.share_to_user_email,
              shareByUserId: userId,
            })
          )
        );
      }

      return data?.delete_shared_template_groups?.returning?.[0] || null;
    },
    unshare_template_group_from_current_user: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation ($template_group_id: uuid!, $user_to: uuid!) {
          delete_shared_template_groups(
            where: {
              template_group_id: { _eq: $template_group_id }
              shared_to_user_id: { _eq: $user_to }
            }
          ) {
            returning {
              id
              template_group_id
              shared_by_user_id
              shared_to_user_id
              created_at
              updated_at
            }
          }
        }
      `;

      const { template_group_id, share_to_user_email } = args.object;

      const data = await gqlClient.request(mutation, {
        template_group_id: template_group_id,
        user_to: userId,
      });

      // unshare all templates in that group
      const getTemplatesInGroup = gql`
        query ($template_group_id: uuid!) {
          template_groups(where: { id: { _eq: $template_group_id } }) {
            templates {
              id
            }
          }
        }
      `;

      // find templates included in the unshared group
      const templates = await gqlClient.request(getTemplatesInGroup, {
        template_group_id,
      });

      const templateIds = templates?.template_groups?.[0].templates.map(
        (t) => t.id
      );

      const unshareTemplateQuery = gql`
        mutation shareTemplate(
          $templateId: String!
          $shareToUserEmail: String!
        ) {
          unshare_template_from_current_user(
            object: {
              template_id: $templateId
              share_to_user_email: $shareToUserEmail
            }
          ) {
            shared_to_user_id
          }
        }
      `;

      // unshare all templates with the user removed from group
      if (templateIds.length > 0) {
        await Promise.all(
          templateIds.map((templateId) =>
            gqlClient.request(unshareTemplateQuery, {
              templateId,
              shareToUserEmail: share_to_user_email,
            })
          )
        );
      }

      return data?.delete_shared_template_groups?.returning?.[0] || null;
    },
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
