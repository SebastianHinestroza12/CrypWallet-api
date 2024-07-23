import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { Wallet } from './Wallet';
import { Cryptocurrency } from './Cryptocurrency';
import { TransactionType } from './TransactionType';
import { getCurrentUnixTimestamp, generateAleatorNumber } from '../utils/date';

export const Transaction = sequelize.define(
  'transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    idPayment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    destinyWalletId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Wallet,
        key: 'id',
      },
      defaultValue: null,
    },
    originWalletId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: null,
      references: {
        model: Wallet,
        key: 'id',
      },
      validate: {
        isUUID: 4,
        notEmpty: true,
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
        isFloat: true,
      },
    },
    cryptocurrencyId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Cryptocurrency,
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TransactionType,
        key: 'id',
      },
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
    date: {
      type: DataTypes.INTEGER,
      defaultValue: getCurrentUnixTimestamp,
    },
    referenceNumber: {
      type: DataTypes.STRING,
      defaultValue: generateAleatorNumber,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    paymentGateway: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  },
);

Wallet.hasMany(Transaction, { foreignKey: 'destinyWalletId' });
Transaction.belongsTo(Wallet, { foreignKey: 'destinyWalletId' });

Wallet.hasMany(Transaction, { foreignKey: 'originWalletId' });
Transaction.belongsTo(Wallet, { foreignKey: 'originWalletId' });

Cryptocurrency.hasMany(Transaction, { foreignKey: 'cryptocurrencyId' });
Transaction.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

TransactionType.hasMany(Transaction, { foreignKey: 'typeId' });
Transaction.belongsTo(TransactionType, { foreignKey: 'typeId' });

