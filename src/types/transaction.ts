import { Optional } from 'sequelize';

export type TransactionStatusAttributes = {
  id: number;
  name: 'pending' | 'completed' | 'failed';
};

export type TransactionTypeAttributes = {
  id: number;
  name: 'Transfer' | 'Purchase' | 'Sale' | 'Deposit' | 'Withdrawal' | 'Payment';
};

export type TransactionStatusCreationAttributes = Optional<TransactionStatusAttributes, 'id'>;
export type TransactionTypeCreationAttributes = Optional<TransactionTypeAttributes, 'id'>;
