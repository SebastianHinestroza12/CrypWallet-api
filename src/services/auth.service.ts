import { comparePassword, generateToken, hashPassword } from '../utils';
import { RegisterUserAttributes, UserAttributes } from '../types';
import { User } from '../models/User';
import { Transaction } from 'sequelize';

class AuthService {
  static async register(
    userData: RegisterUserAttributes,
    transaction: Transaction,
  ): Promise<UserAttributes> {
    const { name, lastName, email, password } = userData;
    const hashedPassword = await hashPassword(password);
    const user = await User.create(
      {
        name,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction },
    );

    return user;
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    const token = generateToken(user);
    return token;
  }

  static async findUserByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    return user;
  }
}

export { AuthService };
