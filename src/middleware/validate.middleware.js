import { verifyRefreshToken } from '../utils/jwtHelper.js';

export const validateRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  const result = verifyRefreshToken(refreshToken);

  if (!result.valid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }

  try {
    const { userRepository: userRepo } = await import('../repositories/user.repository.js');
    const user = await userRepo.findByRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found',
      });
    }

    if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
      });
    }

    req.user = result.decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

