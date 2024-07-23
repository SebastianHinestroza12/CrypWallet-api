/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validateSend } from '../validations/transaction';

const transactionRoutes = Router();

transactionRoutes.post('/');
transactionRoutes.post('/types', TransactionController.createTransactionType);
transactionRoutes.post(
  '/send-crypto',
  validateSend(),
  TransactionController.createSendCryptoTransaction,
);

export { transactionRoutes };
