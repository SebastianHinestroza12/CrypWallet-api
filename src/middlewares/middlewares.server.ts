import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { authMiddleware } from './auth.middleware';

export const middlewares = (app: Application): void => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(cors());
  app.use(helmet());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
  });

  // Middleware to authenticate
  app.use(authMiddleware);
};
