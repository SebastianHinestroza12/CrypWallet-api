import { Optional } from 'sequelize';

export type WalletAttributes = {
  id: string;
  name: string;
  address: string;
  manageCrypto?: string[];
  cryptoCurrency?: { [key: string]: number };
  userId: string;
};

export type WalletCreationAttributes = Optional<WalletAttributes, 'id'>;
