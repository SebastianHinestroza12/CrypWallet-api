import { RegisterUserAttributes, UserAttributes } from '../types';
import { IHashService, ITokenService } from '../interfaces/Authentication';
import { User } from '../models/User';
import { SafeWords } from '../models/SafeWords';
import { FailedAttempts } from '../models/FailedAttempts';
import { Transaction } from 'sequelize';
import { EmailService } from './email.service';

class AuthService {
  private hashService: IHashService;
  private tokenService: ITokenService;
  private emailService: EmailService;

  constructor(hashService: IHashService, tokenService: ITokenService, emailService: EmailService) {
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.emailService = emailService;
  }

  async register(
    userData: RegisterUserAttributes,
    transaction: Transaction,
  ): Promise<UserAttributes> {
    const { name, lastName, email, password } = userData;
    const hashedPassword = await this.hashService.hashPassword(password);
    const user = await User.create(
      {
        name,
        lastName,
        email,
        password: hashedPassword,
      },
      { transaction },
    );

    await this.emailService.sendWelcomeEmail(email, name);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('locked account');
    }

    const isMatch = await this.hashService.comparePassword(password, user.password);
    if (!isMatch) {
      // Registrar Intentos Fallidos
      await this.recordFailedAttempt(user.id);
      throw new Error('Incorrect password');
    }

    //Remover los intentos fallidos del usuario, si tiene alguno.
    await this.removeFailedAttempts(user.id);

    return this.tokenService.generateToken(user);
  }

  async findUserByEmail(email: string): Promise<UserAttributes | null> {
    return User.findOne({
      where: { email },
    });
  }

  async verifySafeWords(userId: string, words: string[]): Promise<boolean> {
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

  async updateUserPassword(
    id: string,
    newPassword: string,
    repiteNewPassword: string,
  ): Promise<void> {
    if (newPassword !== repiteNewPassword) {
      throw new Error('Passwords do not match');
    }
    const findUser = await this.findUserById(id);
    if (!findUser) {
      throw new Error('User does not exist');
    }
    const hashedPassword = await this.hashService.hashPassword(newPassword);
    const [affectedCount] = await User.update({ password: hashedPassword }, { where: { id } });
    if (affectedCount === 0) {
      throw new Error('Failed to update password');
    }
  }

  private findUserById(userId: string): Promise<InstanceType<typeof User> | null> {
    return User.findByPk(userId);
  }

  async updateUserById(
    userId: string,
    userData: Partial<UserAttributes>,
    transaction: Transaction,
  ): Promise<InstanceType<typeof User>> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }
    await user.update(userData, { transaction });
    return user;
  }

  private recordFailedAttempt = async (userId: string) => {
    try {
      await FailedAttempts.create({ userId });
      //Contar Intetos fallidos del usuario
      const failedAttemptsCount = await FailedAttempts.count({ where: { userId } });

      if (failedAttemptsCount >= 5) {
        //Bloquear Usuario
        await User.update({ isActive: false }, { where: { id: userId } });
        throw new Error('locked account');
      }
    } catch (e) {
      const error = <Error>e;
      throw new Error(error.message);
    }
  };

  private removeFailedAttempts = async (userId: string) => {
    try {
      //Contar Intetos fallidos del usuario
      const failedAttemptsCount = await FailedAttempts.count({ where: { userId } });

      if (failedAttemptsCount > 0) {
        //Borrar Intetos fallidos del usuario
        await FailedAttempts.destroy({ where: { userId } });
      }
    } catch (e) {
      const error = <Error>e;
      throw new Error(error.message);
    }
  };
}

export { AuthService };
