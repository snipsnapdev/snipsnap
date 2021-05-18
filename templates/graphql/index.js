require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");
const { GraphQLClient } = require("graphql-request");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const ENCRYPTION_ALGORITHM = "HS512";

const encode = (userId, expires, role = "api-user") => {
  const tokenContent = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": [role],
      "x-hasura-default-role": role,
      "x-hasura-role": role,
      "x-hasura-user-id": userId,
    },
  };
  const encodedToken = jwt.sign(tokenContent, JWT_SECRET, {
    algorithm: ENCRYPTION_ALGORITHM,
    expiresIn: `${expires}s`,
  });
  return encodedToken;
};

const MAX_FILE_SIZE = 5000; /// 5KB
const MAX_FILES_AMOUNT = 20;

const gqlClient = new GraphQLClient(process.env.HASURA_GRAPHQL_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
});

const getUsersTemplateGroupSharedTo = gql`
  query MyQuery($groupId: uuid!) {
    shared_template_groups(where: { template_group_id: { _eq: $groupId } }) {
      shared_to_user {
        id
        name
        image
        email
      }
    }
  }
`;

const shareTemplateQuery = gql`
  mutation shareTemplate(
    $templateId: String!
    $shareToUserEmail: String!
    $shareByUserId: String
  ) {
    share_template(
      object: {
        template_id: $templateId
        share_to_user_email: $shareToUserEmail
        share_by_user_id: $shareByUserId
      }
    ) {
      id
    }
  }
`;

const validatePrompts = (prompts) => {
  if (!Array.isArray(prompts)) return false;

  const variableNames = prompts.map(({ variableName }) => variableName);

  return (
    // Checks if prompts have multiple variableName with the same value or not
    new Set(variableNames).size === prompts.length &&
    // Checks if every prompt has both message and variableName
    prompts.every(({ message, variableName }) => message && variableName)
  );
};

const validateSizesOfFiles = (files) => {
  const callback = ({ type, data }) => {
    if (type === "file") {
      const fileSize = Buffer.byteLength(data.content, "utf8");
      if (fileSize > MAX_FILE_SIZE) {
        console.log("file", data.name, "is too large: ", fileSize, "bites");
      }
      return fileSize <= MAX_FILE_SIZE;
    } else {
      return data.files.every(callback);
    }
  };

  return files.every(callback);
};

// Ignores folders, counts only files
const validateAmountOfFiles = (files) => {
  let amountOfFiles = 0;

  const callback = ({ type, data }) => {
    if (type === "file") {
      amountOfFiles++;
    } else {
      data.files.forEach(callback);
    }
  };

  files.forEach(callback);

  if (amountOfFiles > MAX_FILES_AMOUNT) {
    console.log("too many files");
  }

  return amountOfFiles <= MAX_FILES_AMOUNT;
};

const validateFiles = (files) => {
  const isFileSizesValid = validateSizesOfFiles(files);
  const amountOfFiles = validateAmountOfFiles(files);
  return isFileSizesValid && amountOfFiles;
};

const getUserByEmail = async (email) => {
  const query = gql`
    query ($email: String!) {
      users(where: { email: { _eq: $email } }) {
        user_id
      }
    }
  `;

  const data = await gqlClient.request(query, { email });

  if (!data?.users?.[0]?.user_id) {
    throw new Error("Couldn't find user by email");
  }

  return data?.users?.[0]?.user_id;
};

const typeDefs = gql`
  type Query {
    hello: String
  }

  input InsertTemplateInput {
    name: String!
    prompts: String
    files: String!
    template_group_id: String
  }

  input UpdateTemplateInput {
    id: String!
    name: String
    prompts: String
    files: String
    template_group_id: String
  }

  type Template {
    id: String
    name: String
    prompts: String
    files: String
    template_group_id: String
    owner_id: String
    created_at: String
    updated_at: String
  }

  input ShareTemplateInput {
    template_id: String!
    share_to_user_email: String!
    share_by_user_id: String
  }

  type SharedTemplate {
    id: String
    template_id: String
    shared_by_user_id: String
    shared_to_user_id: String
    created_at: String
    updated_at: String
  }

  input ShareTemplateGroupInput {
    template_group_id: String!
    share_to_user_email: String!
  }

  type SharedTemplateGroup {
    id: String
    template_group_id: String
    shared_by_user_id: String
    shared_to_user_id: String
    created_at: String
    updated_at: String
  }

  input RefreshApiTokenInput {
    user_id: String!
  }

  type RefreshApiToken {
    api_key: String
  }

  type Mutation {
    insert_template(object: InsertTemplateInput): Template
    update_template(object: UpdateTemplateInput): Template
    share_template(object: ShareTemplateInput): SharedTemplate
    unshare_template(object: ShareTemplateInput): SharedTemplate
    share_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
    unshare_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
    refresh_api_token(object: RefreshApiTokenInput): RefreshApiToken
  }
`;

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

      console.log("TOKEN UPDATE", res?.update_api_keys?.returning);

      return res?.update_api_keys?.returning?.[0];
    },
    insert_template: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation (
          $name: String!
          $prompts: jsonb
          $files: jsonb!
          $template_group_id: uuid
          $owner_id: uuid!
        ) {
          insert_templates_one(
            object: {
              name: $name
              files: $files
              prompts: $prompts
              template_group_id: $template_group_id
              owner_id: $owner_id
            }
          ) {
            id
            name
            prompts
            files
            template_group_id
            owner_id
          }
        }
      `;

      const { name, prompts, files, template_group_id } = args.object;

      const isPromptsValid = validatePrompts(JSON.parse(prompts));
      const isFilesValid = validateFiles(JSON.parse(files));

      if (!isPromptsValid) {
        throw new Error("Prompts not valid");
      }

      if (!isFilesValid) {
        throw new Error("Files not valid");
      }

      const res = await gqlClient.request(mutation, {
        name,
        prompts,
        files,
        template_group_id,
        owner_id: userId,
      });

      console.log("res", res);

      // if group was shared - share this template with all that users
      if (template_group_id && res?.insert_templates_one?.id) {
        console.log("group was shared");
        // find users group was shared to
        const users = await gqlClient.request(getUsersTemplateGroupSharedTo, {
          groupId: template_group_id,
        });
        const userEmails =
          users?.shared_template_groups.map(
            (item) => item.shared_to_user.email
          ) || [];

        console.log("shared to emails", userEmails);
        // share template
        if (userEmails.length > 0) {
          await Promise.all(
            userEmails.map((email) =>
              gqlClient.request(shareTemplateQuery, {
                templateId: res.insert_templates_one.id,
                shareToUserEmail: email,
                shareByUserId: userId,
              })
            )
          );
        }
      }

      return res?.insert_templates_one;
    },
    update_template: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation (
          $id: uuid!
          $name: String
          $prompts: jsonb
          $files: jsonb
          $template_group_id: uuid
        ) {
          update_templates_by_pk(
            pk_columns: { id: $id }
            _set: {
              name: $name
              files: $files
              prompts: $prompts
              template_group_id: $template_group_id
            }
          ) {
            id
            name
            prompts
            files
            template_group_id
            owner_id
          }
        }
      `;

      const { id, name, prompts, files, template_group_id } = args.object;

      const isPromptsValid = validatePrompts(JSON.parse(prompts));
      const isFilesValid = validateFiles(JSON.parse(files));

      if (!isPromptsValid || !isFilesValid) return;

      return gqlClient.request(mutation, {
        id,
        name,
        prompts,
        files,
        template_group_id,
      });
    },
    share_template: async (_, args, { userId }) => {
      const { template_id, share_by_user_id } = args.object;

      if (!userId && !share_by_user_id) return;

      console.log("share userId", userId);
      console.log("share arg userId", share_by_user_id);
      console.log("will share to", userId || share_by_user_id);

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

      console.log("sharing", template_id, "TO", shareToUserId);

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
      if (!userId) return;

      const shareToUserId = await getUserByEmail(
        args.object.share_to_user_email
      );

      // Can't unshare from yourself. Yes, even if we let unshare mutation run, it won't delete anything since such item does not exist but still
      if (shareToUserId === userId) return;

      const mutation = gql`
        mutation ($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
        user_by: userId,
        user_to: shareToUserId,
      });

      return data?.delete_shared_templates?.returning?.[0] || null;
    },
    share_template_group: async (_, args, { userId }) => {
      if (!userId) return;

      const shareToUserId = await getUserByEmail(
        args.object.share_to_user_email
      );

      // Can't share with yourself
      if (shareToUserId === userId) return;

      const query = gql`
        query ($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
          shared_template_groups(
            where: {
              _and: [
                { template_group_id: { _eq: $template_group_id } }
                { shared_by_user_id: { _eq: $user_by } }
                { shared_to_user_id: { _eq: $user_to } }
              ]
            }
          ) {
            id
            template_group_id
            shared_by_user_id
            shared_to_user_id
            created_at
            updated_at
          }
        }
      `;

      const { template_group_id } = args.object;

      const queryData = await gqlClient.request(query, {
        template_group_id: template_group_id,
        user_by: userId,
        user_to: shareToUserId,
      });

      // If template group is already shared then we do not need to share it again
      if (queryData?.shared_template_groups?.length > 0) return;

      const mutation = gql`
        mutation ($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
          insert_shared_template_groups_one(
            object: {
              template_group_id: $template_group_id
              shared_by_user_id: $user_by
              shared_to_user_id: $user_to
            }
          ) {
            id
            template_group_id
            shared_by_user_id
            shared_to_user_id
            created_at
            updated_at
          }
        }
      `;

      const mutationData = await gqlClient.request(mutation, {
        template_group_id: template_group_id,
        user_by: userId,
        user_to: shareToUserId,
      });

      return mutationData?.insert_shared_template_groups_one || null;
    },
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

      return data?.delete_shared_template_groups?.returning?.[0] || null;
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
