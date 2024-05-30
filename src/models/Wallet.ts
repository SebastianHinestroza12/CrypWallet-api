import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';
import { WalletInstance } from '../interfaces';

export const Wallet = sequelize.define<WalletInstance>(
  'wallet',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
        len: [2, 50],
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
        isAlpha: true,
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
      defaultValue: { bitcoin: 0.059, tether: 2505.01 },
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });
