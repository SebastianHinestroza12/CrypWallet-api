import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { UserInstance } from '../interfaces';
import { getCurrentUnixTimestamp } from '../utils/date';

export const User = sequelize.define<UserInstance>(
  'user',
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
        isAlpha: true,
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: true,
        min: 6,
        max: 6,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    registrationDate: {
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
