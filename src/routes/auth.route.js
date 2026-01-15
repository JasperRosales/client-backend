import { Router } from 'express';
import { register, login, refresh, logout } from '../controller/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validateRefreshToken } from '../middleware/validate.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh', validateRefreshToken, refresh);
router.post('/logout', authenticateToken, logout);

export default router;

