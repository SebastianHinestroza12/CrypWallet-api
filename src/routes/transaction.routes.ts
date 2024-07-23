/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validateSend, validateCryptoPurchase } from '../validations/transaction';

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

export { transactionRoutes };
