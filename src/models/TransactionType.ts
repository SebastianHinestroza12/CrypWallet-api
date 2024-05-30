import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { TransactionTypeInstance } from '../interfaces';

export const TransactionType = sequelize.define<TransactionTypeInstance>(
  'transaction_type',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM('Transfer', 'Purchase', 'Sale', 'Deposit', 'Withdrawal', 'Payment'),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['Transfer', 'Purchase', 'Sale', 'Deposit', 'Withdrawal', 'Payment']],
      },
    },
  },
  {
    timestamps: false,
  },
);
