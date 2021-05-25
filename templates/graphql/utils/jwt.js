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

module.exports = { encode };
