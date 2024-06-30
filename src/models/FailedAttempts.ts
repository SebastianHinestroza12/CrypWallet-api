import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';
import { getCurrentUnixTimestamp } from '../utils/date';

export const FailedAttempts = sequelize.define(
  'failed_attempts',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
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
    date: {
      type: DataTypes.INTEGER,
      defaultValue: getCurrentUnixTimestamp,
      validate: {
        isInt: true,
      },
    },
  },
  {
    timestamps: false,
  },
);

User.hasMany(FailedAttempts, { foreignKey: 'userId' });
FailedAttempts.belongsTo(User, { foreignKey: 'userId' });
