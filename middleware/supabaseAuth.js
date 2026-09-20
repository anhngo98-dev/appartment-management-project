const { createRemoteJWKSet, jwtVerify } = require('jose');

const jwksUrl = process.env.SUPABASE_JWKS_URL || `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`;
const JWKS = createRemoteJWKSet(new URL(jwksUrl));

async function protectSupabase(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['RS256']
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'user',
      ...payload
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Supabase token' });
  }
}

module.exports = {
  protectSupabase
};
