import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import corsOptions from './config/cors.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to client-backend API',
    status: 'success',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);

export default app;
