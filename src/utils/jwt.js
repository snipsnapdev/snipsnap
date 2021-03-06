import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

const ENCRYPTION_ALGORITHM = 'HS512';

// Don't use on the client side
const encode = (userId, expires) => {
  const tokenContent = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-role': 'user',
      'x-hasura-user-id': userId,
    },
  };
  const encodedToken = jwt.sign(tokenContent, JWT_SECRET, {
    algorithm: ENCRYPTION_ALGORITHM,
    expiresIn: `${expires}s`,
  });
  return encodedToken;
};

// Don't use on the client side
const decode = ({ token }) => {
  const decodedToken = jwt.verify(token, JWT_SECRET, {
    algorithms: 'HS512',
  });

  return decodedToken;
};

export default { encode, decode };
