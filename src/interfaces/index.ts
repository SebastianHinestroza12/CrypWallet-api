import { Model } from 'sequelize';
import {
  UserCreationAttributes,
  UserAttributes,
  CryptocurrencyAttributes,
  CryptocurrencyCreationAttributes,
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
  id: string;
  newPassword: string;
  repiteNewPassword: string;
}
