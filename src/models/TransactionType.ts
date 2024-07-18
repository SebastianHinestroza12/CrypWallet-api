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
      type: DataTypes.ENUM('Send', 'Receive', 'Buy', 'Sell', 'Swap', 'None'),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['Send', 'Receive', 'Buy', 'Sell', 'Swap']],
      },
    },
  },
  {
    timestamps: false,
  },
);
