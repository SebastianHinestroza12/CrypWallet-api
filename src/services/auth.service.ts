import { comparePassword, generateToken, hashPassword } from '../utils';
import { RegisterUserAttributes, UserAttributes } from '../types';
import { User } from '../models/User';
import { SafeWords } from '../models/SafeWords';

class AuthService {
  static async register(userData: RegisterUserAttributes): Promise<UserAttributes> {
    const { name, lastName, email, password } = userData;
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    return user;
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await this.findUserByEmail(email);

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

  static async verifySafeWords(userId: string, words: string[]): Promise<boolean | Error> {
    const safeWordsRecord = await SafeWords.findOne({ where: { userId } });
    if (!safeWordsRecord) {
      throw new Error('This user does not have safe words or does not exist');
    }

    const wordsUser = safeWordsRecord.words;
    if (!Array.isArray(wordsUser) || wordsUser.length !== words.length) {
      throw new Error('Safe words do not match');
    }

    const isMatch = wordsUser.every((word, index) => word === words[index]);
    if (!isMatch) {
      throw new Error('Incorrect safe words');
    }

    return true;
  }

  static async updateUserPassword(
    userId: string,
    newPassword: string,
    repiteNewPassword: string,
  ): Promise<boolean | Error> {
    const findUser = await this.findUserById(userId);

    if (!findUser) {
      throw new Error('User does not exist');
    }

    if (newPassword !== repiteNewPassword) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await hashPassword(newPassword);
    const [affectedCount] = await User.update(
      { password: hashedPassword },
      { where: { id: userId } },
    );

    if (affectedCount === 0) {
      throw new Error('Failed to update password');
    }

    return true;
  }

  private static findUserById(userId: string): Promise<UserAttributes | null> {
    return User.findByPk(userId);
  }
}

export { AuthService };
