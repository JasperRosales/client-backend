import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controller/otp.controller.js';
import { otpRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/request', otpRateLimiter, requestOtp);
router.post('/verify', otpRateLimiter, verifyOtp);

export default router;

