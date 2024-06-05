import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import status from 'http-status';

class TransactionController {
  static readonly createTransactionType = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transactionType = await TransactionService.createTransactionType();
      return res.status(status.CREATED).json({
        message: 'Transaction type created successfully',
        transactionType,
      });
    } catch (error) {
      next(error);
    }
  };

  static readonly createTransactionStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transactionStatus = await TransactionService.createTransactionStatus();
      return res.status(status.CREATED).json({
        message: 'Transaction status created successfully',
        transactionStatus,
      });
    } catch (error) {
      next(error);
    }
  };
}

export { TransactionController };
