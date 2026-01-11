import { verifyAccessToken } from '../utils/jwtHelper.js';

export const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  
  if (!accessToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required',
      requiresRefresh: true 
    });
  }

  const result = verifyAccessToken(accessToken);
  
  if (result.valid) {
    req.user = result.decoded;
    next();
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token expired',
      requiresRefresh: true 
    });
  }
};

