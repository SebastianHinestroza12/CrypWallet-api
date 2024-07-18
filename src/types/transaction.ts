import { Optional } from 'sequelize';

export type TransactionTypeAttributes = {
  id: number;
  name: 'Send' | 'Receive' | 'Buy' | 'Sell' | 'Swap' | 'None';
};

export type SendTransactionIProps = {
  amount: number;
  cryptocurrencyId: string;
  destinyWalletId: string;
  originWalletId: string;
  description: string;
};

export type UpdateBalanceIProps = {
  type: 'increment' | 'decrement';
  amount: number;
  walletId: string;
  cryptoCurrency: string;
};

export type TransactionTypeCreationAttributes = Optional<TransactionTypeAttributes, 'id'>;
