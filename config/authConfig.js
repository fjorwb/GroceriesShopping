// Security: AUTH_SECRET must be set in production
if (!process.env.AUTH_SECRET) {
  console.error('⚠️  WARNING: AUTH_SECRET environment variable is not set!')
  console.error('⚠️  This is a security risk. Please set AUTH_SECRET in your .env file.')
  console.error('⚠️  For development, you can set a temporary value, but NEVER commit it to version control.')
  
  // In production, we should fail. In development, we'll use a weak default with warning
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET environment variable must be set in production for security')
  }
}

module.exports = {
  secret: process.env.AUTH_SECRET || 'CHANGE_THIS_IN_PRODUCTION_OR_SET_AUTH_SECRET_ENV_VAR',
  expiresIn: process.env.AUTH_EXPIRESIN || '24h',
  rounds: process.env.AUTH_ROUNDS || 10
}
