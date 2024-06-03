import { Model } from 'sequelize';
import {
  UserCreationAttributes,
  UserAttributes,
  CryptocurrencyAttributes,
  CryptocurrencyCreationAttributes,
  TransactionStatusAttributes,
  TransactionStatusCreationAttributes,
  TransactionTypeAttributes,
  TransactionTypeCreationAttributes,
  SafeWordsAttributes,
  SafeWordsCreationAttributes,
  WalletAttributes,
  WalletCreationAttributes,
} from '../types';

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export interface TransactionStatusInstance
  extends Model<TransactionStatusAttributes, TransactionStatusCreationAttributes>,
    TransactionStatusAttributes {}

export interface CryptocurrencyInstance
  extends Model<CryptocurrencyAttributes, CryptocurrencyCreationAttributes>,
    CryptocurrencyAttributes {}

export interface TransactionTypeInstance
  extends Model<TransactionTypeAttributes, TransactionTypeCreationAttributes>,
    TransactionTypeAttributes {}

export interface SafeWordsInstance
  extends Model<SafeWordsAttributes, SafeWordsCreationAttributes>,
    SafeWordsAttributes {}

export interface WalletInstance
  extends Model<WalletAttributes, WalletCreationAttributes>,
    WalletAttributes {}

export interface VerifySafeWordsRequestBody {
  userId: string;
  words: string[];
}

export interface UpdatePassword {
  userId: string;
  newPassword: string;
  repiteNewPassword: string;
}
