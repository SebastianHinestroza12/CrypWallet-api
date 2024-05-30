import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { CryptocurrencyInstance } from '../interfaces';

export const Cryptocurrency = sequelize.define<CryptocurrencyInstance>(
  'cryptocurrency',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      validate: {
        notEmpty: true,
        isAlpha: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
      },
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
      },
    },
  },
  {
    timestamps: false,
  },
);
