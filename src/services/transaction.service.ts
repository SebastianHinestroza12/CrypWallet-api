import { TransactionType } from '../models/TransactionType';
import { TransactionStatus } from '../models/TransactionStatus';
import { TransactionTypeAttributes, TransactionStatusAttributes } from '../types';

class TransactionService {
  static async createTransactionType(): Promise<TransactionTypeAttributes[]> {
    const transactionType = await TransactionType.bulkCreate(
      [
        { name: 'Transfer' },
        { name: 'Purchase' },
        { name: 'Sale' },
        { name: 'Deposit' },
        { name: 'Withdrawal' },
        { name: 'Payment' },
      ],
      {
        updateOnDuplicate: ['name'],
      },
    );

    return transactionType;
  }

  static async createTransactionStatus(): Promise<TransactionStatusAttributes[]> {
    const transactionStatus = await TransactionStatus.bulkCreate(
      [{ name: 'completed' }, { name: 'pending' }, { name: 'failed' }],
      {
        updateOnDuplicate: ['name'],
      },
    );

    return transactionStatus;
  }
}

export { TransactionService };
