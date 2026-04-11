const isProduction = process.env.NODE_ENV === 'production';

let hasWarnedAboutJwtSecret = false;

exports.getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (isProduction) {
    throw new Error('JWT_SECRET is not configured');
  }

  if (!hasWarnedAboutJwtSecret) {
    console.warn('JWT_SECRET is not configured. Falling back to a local development secret.');
    hasWarnedAboutJwtSecret = true;
  }

  return 'local-dev-jwt-secret';
};
