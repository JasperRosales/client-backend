import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import corsOptions from './config/cors.js';
import authRoutes from './routes/auth.route.js';
import otpRoutes from './routes/otp.route.js';
import chatRoutes from './routes/chat.route.js';
import emailRoutes from './routes/email.route.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const origin = corsOptions.origin;
const originStr = Array.isArray(origin) ? origin.join(', ') : origin;
console.log(`CORS allowed origins: ${originStr}`);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to client-backend API',
    status: 'success',
    version: '4.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/email', emailRoutes);

export default app;

