import jwt from 'utils/jwt';

const { JWT_API_MAX_AGE } = process.env;

const generateToken = (session) => {
  const token = jwt.encode(session.user.id, 60 * 60);
  return token;
};

export default generateToken;
