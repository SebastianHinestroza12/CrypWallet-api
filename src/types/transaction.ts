import { Optional } from 'sequelize';

export type TransactionTypeAttributes = {
  id: number;
  name: 'Send' | 'Receive' | 'Buy' | 'Swap' | 'None';
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

export type UpdateAmountIProps = {
  id: string;
  amount: number;
  type: 'increment' | 'decrement';
  walletId: string;
};

export type PaymentDetailIProps = {
  cryptoID: string;
  amount: number;
  idPayment: string;
  paymentGateway: string;
  originWalletId: string;
};

export type TransactionUserIProps = {
  id: number;
  idPayment: string | null;
  destination: string | null;
  origin: string;
  amount: number;
  symbol: string;
  name_cryptocurrency: string;
  type_transaction: string;
  referenceNumber: string;
  paymentGateway: string | null;
  user_origin: string;
  formatted_date: string;
  user_destination: string | null;
  cryptoFromId: string | null;
  cryptoToId: string | null;
  amountFrom: number | null;
  amountTo: number | null;
};

export type TransactionTypeCreationAttributes = Optional<TransactionTypeAttributes, 'id'>;
