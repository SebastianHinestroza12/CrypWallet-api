import { Optional } from 'sequelize';

export type CryptocurrencyAttributes = {
  id: string;
  name: string;
  symbol: string;
};

export type CryptocurrencyCreationAttributes = Optional<CryptocurrencyAttributes, 'id'>;
