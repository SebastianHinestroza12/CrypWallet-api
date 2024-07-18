import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import { SendTransactionIProps } from '../types/transaction';
import { sequelize } from '../database';
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

  static readonly createSendCryptoTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const transaction = await sequelize.transaction();
    try {
      const data = req.body as SendTransactionIProps;

      const transferCripto = await TransactionService.createSendCryptoTransaction(
        data,
        transaction,
      );

      await transaction.commit();

      return res.status(status.CREATED).json({
        message: 'Transaction created successfully',
        dataTransfer: transferCripto,
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
}

export { TransactionController };
