import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import express, { NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { Request, Response } from 'express';
import { authRouter } from './routes/auth.routes';
import { userRouter } from './routes/user.routes';
import { checkJwtExists } from './middleware/auth.middleware';

export const prismaDB = new PrismaClient({
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn'],
});

const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// static files
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req: Request, res: Response) => {
  res.send('home');
});

// routes
app.use('/api/auth', authRouter);
app.use(checkJwtExists);
app.use('/api/user', userRouter);

// 404 handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: '404 - Route not found' });
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('--- error handler');
  console.error(err);

  res.status(500).json({ error: err.message });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
