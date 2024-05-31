import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import status from 'http-status';

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    logger.error(err);
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Errordd' });
  }
  next();
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('Route not found');
  return res.status(status.NOT_FOUND).json({ message: 'Route No found' });
};
