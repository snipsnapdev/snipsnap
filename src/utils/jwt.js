import jose from 'jose';
import hkdf from 'futoin-hkdf';

const SIGNATURE_ALGORITHM = 'HS512';
const MAX_AGE = 24 * 60 * 60; // 1 day
const signingOptions = {
  expiresIn: `${MAX_AGE}s`,
};
const { JWT_SIGNING_PRIVATE_KEY } = process.env;

const getSigningKey = () => {
  const key = Buffer.from(JWT_SIGNING_PRIVATE_KEY, 'base64').toString();
  return jose.JWK.asKey(JSON.parse(key));
};
const sign = ({ token }) => {
  const _signingKey = getSigningKey();
  const signedToken = jose.JWT.sign(token, _signingKey, signingOptions);
  return signedToken;
};

export default { sign };
