import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { AuthMiddleware } from './auth.middleware';

export const middlewares = (app: Application): void => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  app.use(helmet());

  const authMiddlewareInstance = new AuthMiddleware();
  app.use(authMiddlewareInstance.middleware.bind(authMiddlewareInstance));
};
