import { userRepository } from '../repositories/user.repository.js';
import { verifyRefreshToken } from '../utils/jwtHelper.js';

export const validateRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'Refresh token required' 
    });
  }

  const result = verifyRefreshToken(refreshToken);
  
  if (!result.valid) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid refresh token' 
    });
  }

  const user = await userRepository.findByRefreshToken(refreshToken);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Refresh token not found' 
    });
  }

  if (user.refreshTokenExpiresAt && new Date() > user.refreshTokenExpiresAt) {
    return res.status(401).json({ 
      success: false, 
      message: 'Refresh token expired' 
    });
  }

  req.user = result.decoded;
  next();
};

