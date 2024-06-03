import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { TransactionStatusInstance } from '../interfaces';

export const TransactionStatus = sequelize.define<TransactionStatusInstance>(
  'transaction_statu',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['pending', 'completed', 'failed']],
      },
    },
  },
  {
    timestamps: false,
  },
);
