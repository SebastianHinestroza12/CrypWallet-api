import { Optional } from 'sequelize';

export type CryptocurrencyAttributes = {
  id: string;
  name: string;
};

export type CryptocurrencyCreationAttributes = Optional<CryptocurrencyAttributes, 'id'>;
