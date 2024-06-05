import { Application } from 'express';
import { authRoute } from './auth.routes';
import { crypoRouter } from './crypto.routes';
import { transactionRoutes } from './transaction.routes';
import { notFoundHandler } from '../middlewares/errorHandler';

export const routes = (app: Application): void => {
  // Authentication routes
  app.use('/api/v1/auth', authRoute);

  //Cryptocurrency routes
  app.use('/api/v1', crypoRouter);

  //Transaction routes
  app.use('/api/v1/transaction', transactionRoutes);

  //Not found route
  app.use(notFoundHandler);
};
