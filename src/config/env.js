const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access-secret-key',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-secret-key',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '3d',
  },
  cookie: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: {
      accessToken: 15 * 60 * 1000,
      refreshToken: 3 * 24 * 60 * 60 * 1000,
    },
  },
  bcryptSaltRounds: 10,
};

export default config;

