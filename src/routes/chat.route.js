import { Router } from 'express';
import { chatWithGemini } from '../controller/chat.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/message', authenticateToken, chatRateLimiter, chatWithGemini);

export default router;

