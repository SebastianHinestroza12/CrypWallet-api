/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import {
  validateSend,
  validateCryptoPurchase,
  validateSwap,
  userIdValidate,
} from '../validations/transaction';

const transactionRoutes = Router();

transactionRoutes.post(
  '/crypto-purchase',
  validateCryptoPurchase(),
  TransactionController.cryptoPurchase,
);
transactionRoutes.post('/types', TransactionController.createTransactionType);
transactionRoutes.post(
  '/send-crypto',
  validateSend(),
  TransactionController.createSendCryptoTransaction,
);
transactionRoutes.post(
  '/swap-crypto',
  validateSwap(),
  TransactionController.cryptocurrencyExchange,
);

transactionRoutes.get('/:userId', userIdValidate(), TransactionController.getAllTransactionByUser);

export { transactionRoutes };
