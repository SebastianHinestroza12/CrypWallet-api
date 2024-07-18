/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';

const transactionRoutes = Router();

transactionRoutes.post('/');
transactionRoutes.post('/types', TransactionController.createTransactionType);
transactionRoutes.post('/send-crypto', TransactionController.createSendCryptoTransaction);

export { transactionRoutes };
