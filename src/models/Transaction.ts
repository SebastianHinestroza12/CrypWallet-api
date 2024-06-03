import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { Wallet } from './Wallet';
import { Cryptocurrency } from './Cryptocurrency';
import { TransactionType } from './TransactionType';
import { TransactionStatus } from './TransactionStatus';
import { getCurrentUnixTimestamp } from '../utils/date';

export const Transaction = sequelize.define(
  'transaction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    receiverWalletId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Wallet,
        key: 'id',
      },
    },
    walletId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TransactionStatus,
        key: 'id',
      },
      validate: {
        notEmpty: true,
        isInt: true,
      },
    },
  },
  {
    timestamps: false,
  },
);

Wallet.hasMany(Transaction, { foreignKey: 'receiverWalletId' });
Transaction.belongsTo(Wallet, { foreignKey: 'receiverWalletId' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId' });

Cryptocurrency.hasMany(Transaction, { foreignKey: 'cryptocurrencyId' });
Transaction.belongsTo(Cryptocurrency, { foreignKey: 'cryptocurrencyId' });

TransactionType.hasMany(Transaction, { foreignKey: 'typeId' });
Transaction.belongsTo(TransactionType, { foreignKey: 'typeId' });

TransactionStatus.hasMany(Transaction, { foreignKey: 'statusId' });
Transaction.belongsTo(TransactionStatus, { foreignKey: 'statusId' });
