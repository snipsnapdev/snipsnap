const { gql } = require("apollo-server");

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

  input AddEventInput {
    event: String!
    user_id: String!
    metadata: String
  }

  type Event {
    user_id: String!
    timestamp: String!
    event: String!
    metadata: String
  }

  type Mutation {
    insert_template(object: InsertTemplateInput): Template
    update_template(object: UpdateTemplateInput): Template
    share_template(object: ShareTemplateInput): SharedTemplate
    unshare_template(object: ShareTemplateInput): SharedTemplate
    unshare_template_from_current_user(
      object: ShareTemplateInput
    ): SharedTemplate
    share_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
    unshare_template_group(object: ShareTemplateGroupInput): SharedTemplateGroup
    unshare_template_group_from_current_user(
      object: ShareTemplateGroupInput
    ): SharedTemplateGroup
    refresh_api_token(object: RefreshApiTokenInput): RefreshApiToken
    add_event(object: AddEventInput): Event
  }
`;

module.exports = { typeDefs };
