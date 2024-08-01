import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';
import {
  SendTransactionIProps,
  PaymentDetailIProps,
  ExchangeDataIProps,
} from '../types/transaction';
import { sequelize } from '../database';
import status from 'http-status';
import { validateData } from '../helper/validateData';

export class TransactionController {
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
  ): Promise<Response | void> => {
    validateData(req, res);
    const transaction = await sequelize.transaction();
    try {
      const data = req.body as SendTransactionIProps;

      const transferCripto = await TransactionService.createSendCryptoTransaction(
        data,
        transaction,
      );

      await transaction.commit();

      return res.status(status.CREATED).json({
        message: 'Transaction completed successfully',
        dataTransfer: transferCripto,
      });
    } catch (e) {
      const error = <Error>e;
      await transaction.rollback();
      return res.status(status.BAD_REQUEST).json({
        message: `${error.message}`,
      });
    }
  };

  static readonly cryptocurrencyExchange = async (
    req: Request,
    res: Response,
  ): Promise<Response | void> => {
    validateData(req, res);
    const transaction = await sequelize.transaction();
    try {
      const dataSwap = req.body as ExchangeDataIProps;
      const swap = await TransactionService.cryptocurrencyExchange(dataSwap, transaction);
      await transaction.commit();

      return res.status(status.OK).json({
        message: 'Transaction completed successfully',
        data: swap,
      });
    } catch (e) {
      const error = <Error>e;
      await transaction.rollback();
      return res.status(status.BAD_REQUEST).json({
        message: `${error.message}`,
      });
    }
  };

  static readonly cryptoPurchase = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    validateData(req, res);
    const transaction = await sequelize.transaction();

    try {
      const data = req.body as PaymentDetailIProps;

      const payment = await TransactionService.cryptoPurchase(data, transaction);

      await transaction.commit();

      return res.status(status.CREATED).json({
        message: 'Transaction created successfully',
        payment,
      });
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      next(error);
    }
  };
}

