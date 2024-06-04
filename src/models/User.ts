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
        len: {
          args: [2, 50],
          msg: 'Name must be between 2 and 50 characters',
        },
      },
    },
    lastName: {
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
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
