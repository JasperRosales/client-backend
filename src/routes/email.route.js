import { Router } from 'express';
import { sendContactMessage } from '../controller/email.controller.js';

const router = Router();

router.post('/send', sendContactMessage);

export default router;

