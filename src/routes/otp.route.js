import { Router } from 'express';
import { requestOtp, verifyOtp } from '../controller/otp.controller.js';

const router = Router();

router.post('/request', requestOtp);
router.post('/verify', verifyOtp);

export default router;

