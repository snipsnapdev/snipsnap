import jwt from 'jsonwebtoken';

const MAX_AGE = 8 * 60 * 60; // 8 hours

const { JWT_SECRET } = process.env;

const ENCRYPTION_ALGORITHM = 'HS512';

const encode = (user, expires) => {
  const tokenContent = {
    id: user.userId,
    name: user.name,
    email: user.email,
    picture: user.picture,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-role': 'user',
      'x-hasura-user-id': user.userId,
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
