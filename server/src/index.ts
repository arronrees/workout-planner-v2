import * as dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { Request, Response } from 'express';

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
