import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';
import { WalletInstance } from '../interfaces';

export const Wallet = sequelize.define<WalletInstance>('wallet', {
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
  cryptoCurrency: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
});

User.hasMany(Wallet, { foreignKey: 'userId' });
Wallet.belongsTo(User, { foreignKey: 'userId' });
