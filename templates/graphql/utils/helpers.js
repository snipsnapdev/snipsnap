const { gql } = require("apollo-server");
const { gqlClient } = require("../api/client");

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

module.exports = { getUserByEmail };
