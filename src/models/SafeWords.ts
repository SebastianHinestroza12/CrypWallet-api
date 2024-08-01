import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';
import { SafeWordsInstance } from '../interfaces';

export const SafeWords = sequelize.define<SafeWordsInstance>(
  'safe_word',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id',
      },
      validate: {
        isUUID: 4,
        notEmpty: true,
      },
    },
    words: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      validate: {
        notEmpty: true,
        isArrayOfLength12(value: string[]) {
          if (value.length !== 12) {
            throw new Error('The array of words must have exactly 12 elements.');
          }
        },
      },
    },
  },
  {
    timestamps: false,
  },
);

User.hasOne(SafeWords, { foreignKey: 'userId', as: 'safeWords' });
SafeWords.belongsTo(User, { foreignKey: 'userId', as: 'user' });
