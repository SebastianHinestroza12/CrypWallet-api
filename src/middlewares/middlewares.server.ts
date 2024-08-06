import express, { Application } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { AuthMiddleware } from './auth.middleware';
import { getEnvVariable } from '../utils';

const clientUrl = getEnvVariable('CLIENT_URL');

export const middlewares = (app: Application): void => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type'],
    }),
  );
  app.use(helmet());

  const authMiddlewareInstance = new AuthMiddleware();
  app.use(authMiddlewareInstance.middleware.bind(authMiddlewareInstance));
};
