import jwt from 'utils/jwt';

const { JWT_API_MAX_AGE } = process.env;

const generateToken = (session) => jwt.encode(session.user.id, JWT_API_MAX_AGE);

export default generateToken;
