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
      accessToken: 15 * 60 * 1000, //15 minutes
      refreshToken: 3 * 24 * 60 * 60 * 1000, //3 days
    },
  },
  bcryptSaltRounds: 10,
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    user: process.env.EMAIL_USER || 'example@gmail.com',
    password: process.env.APP_PASSWORD || '',
  },
  otp: {
    length: 6,
    expiry: 20 * 60 * 1000, // 20 minutes
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
  },
};

export default config;

