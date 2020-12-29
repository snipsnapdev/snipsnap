import jwt from 'jsonwebtoken';

const MAX_AGE = 24 * 60 * 60; // 1 day

const { JWT_SECRET } = process.env;

const ENCRYPTION_ALGORITHM = 'HS512';

const encode = ({ token }) => {
  const tokenContent = {
    id: token.id,
    name: token.name,
    email: token.email,
    picture: token.picture,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-role': 'user',
      'x-hasura-user-id': token.id,
    },
  };
  const encodedToken = jwt.sign(tokenContent, JWT_SECRET, {
    algorithm: ENCRYPTION_ALGORITHM,
    expiresIn: `${MAX_AGE}s`,
  });
  return encodedToken;
};

const decode = ({ token }) => {
  const decodedToken = jwt.verify(token, JWT_SECRET, {
    algorithms: 'HS512',
  });

  return decodedToken;
};

export default { encode, decode };
