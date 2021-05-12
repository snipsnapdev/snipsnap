require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");
const { GraphQLClient } = require("graphql-request");

const MAX_FILE_SIZE = 5000; /// 5KB
const MAX_FILES_AMOUNT = 20;

const gqlClient = new GraphQLClient(process.env.HASURA_GRAPHQL_URL, {
  headers: {
    "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  },
});

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
    query($email: String!) {
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

  type Mutation {
    insert_template(object: InsertTemplateInput): Template
    update_template(object: UpdateTemplateInput): Template
    share_template(object: ShareTemplateInput): SharedTemplate
    unshare_template(object: ShareTemplateInput): SharedTemplate
    share_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
    unshare_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
  }
`;

const resolvers = {
  Mutation: {
    insert_template: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation(
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

      return res?.insert_templates_one;
    },
    update_template: async (_, args, { userId }) => {
      if (!userId) return;

      const mutation = gql`
        mutation(
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
      if (!userId) return;

      const shareToUserId = await getUserByEmail(
        args.object.share_to_user_email
      );

      // Can't share with yourself
      if (shareToUserId === userId) return;

      const query = gql`
        query($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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

      const { template_id } = args.object;

      const queryData = await gqlClient.request(query, {
        template_id: template_id,
        user_by: userId,
        user_to: shareToUserId,
      });

      // If template is already shared then we do not need to share it again
      if (queryData?.shared_templates?.length > 0) return;

      const mutation = gql`
        mutation($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
        user_by: userId,
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
        mutation($template_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
        query($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
        mutation($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
        mutation($template_group_id: uuid!, $user_by: uuid!, $user_to: uuid!) {
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
  typeDefs,
  resolvers,
  context,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
