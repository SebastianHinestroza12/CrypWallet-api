import { DataTypes } from 'sequelize';
import { sequelize } from '../database';
import { User } from './User';

export const OTP = sequelize.define('otp_code', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
});

User.hasMany(OTP, { foreignKey: 'userId' });
OTP.belongsTo(User, { foreignKey: 'userId' });
