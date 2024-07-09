import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';
import { WalletInstance } from '../interfaces';

export const Wallet = sequelize.define<WalletInstance>(
  'wallet',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [2, 50],
          msg: 'Name must be between 2 and 50 characters',
        },
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      validate: {
        notEmpty: true,
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
      },
    },
    manageCrypto: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [
        'bitcoin',
        'ethereum',
        'tether',
        'binancecoin',
        'solana',
        'staked-ether',
        'usd-coin',
      ],
    },
    cryptoCurrency: {
      type: DataTypes.JSON,
      defaultValue: { BTC: 0.459, ETH: 3.0023, BNB: 874300.023 },
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });
