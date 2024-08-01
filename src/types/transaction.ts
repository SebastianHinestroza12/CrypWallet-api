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

export type ExchangeDataIProps = {
  walletId: string;
  data: CryptoExchange[];
};

export type CryptoExchange = {
  id: string;
  currentAmountCrypto?: number;
  amount: number;
  type: 'increment' | 'decrement';
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
};

export type TransactionTypeCreationAttributes = Optional<TransactionTypeAttributes, 'id'>;
