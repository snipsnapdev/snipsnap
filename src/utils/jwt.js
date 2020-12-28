import jose from 'jose';
import hkdf from 'futoin-hkdf';

const SIGNATURE_ALGORITHM = 'HS512';
const MAX_AGE = 24 * 60 * 60; // 1 day
const signingOptions = {
  expiresIn: `${MAX_AGE}s`,
};

const getDerivedSigningKey = (secret) => {
  const buffer = hkdf(secret, 64, { info: 'NextAuth.js Generated Signing Key', hash: 'SHA-256' });
  const key = jose.JWK.asKey(buffer, {
    alg: SIGNATURE_ALGORITHM,
    use: 'sig',
    kid: 'nextauth-auto-generated-signing-key',
  });
  return key;
};

const sign = ({ token, secret }) => {
  const _signingKey = getDerivedSigningKey(secret);
  const signedToken = jose.JWT.sign(token, _signingKey, signingOptions);
  return signedToken;
};

export default { sign };
