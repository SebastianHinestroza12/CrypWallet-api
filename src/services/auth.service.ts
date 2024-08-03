/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RegisterUserAttributes, UserAttributes } from '../types';
import { IHashService, ITokenService, IGenerateOtpCode } from '../interfaces/Authentication';
import { User } from '../models/User';
import { SafeWords } from '../models/SafeWords';
import { FailedAttempts } from '../models/FailedAttempts';
import { Transaction } from 'sequelize';
import { EmailService } from './email.service';
import { OTP } from '../models/Otp';
import { decrypt } from '../utils';

class AuthService {
  private hashService: IHashService;
  private tokenService: ITokenService;
  private emailService: EmailService;
  private otpCode: IGenerateOtpCode;

  constructor(
    hashService: IHashService,
    tokenService: ITokenService,
    emailService: EmailService,
    otpCode: IGenerateOtpCode,
  ) {
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.emailService = emailService;
    this.otpCode = otpCode;
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

  async login(email: string, password: string) {
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

    return {
      token: this.tokenService.generateToken(user),
      user,
    };
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

    const isMatch = wordsUser.every((word, index) => {
      const decryptWords = decrypt(word);
      return decryptWords === words[index];
    });

    if (!isMatch) {
      throw new Error('Incorrect safe words');
    }

    return true;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<void> {
    const findUser = await this.findUserById(id);
    if (!findUser) {
      throw new Error('User does not exist');
    }
    const hashedPassword = await this.hashService.hashPassword(newPassword);
    const [affectedCount] = await User.update(
      { password: hashedPassword, isActive: true },
      { where: { id } },
    );
    if (affectedCount === 0) {
      throw new Error('Failed to update password');
    }
    // Remover los intentos fallidos del usuario, si tiene alguno.
    await this.removeFailedAttempts(id);
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
    // Excluir el campo `email` de `userData`
    const { email, ...dataToUpdate } = userData;

    await user.update(dataToUpdate, { transaction });
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

  async generateAndSendOTP(email: string, transaction: Transaction) {
    try {
      //Verificar la existencia del usuario
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      //Generamos el codido de 6 digitos
      const otp = this.otpCode.generateOtpCode();

      // Guardar OTP en la base de datos
      await OTP.create(
        {
          userId: user.id,
          otpCode: otp,
        },
        { transaction },
      );

      // Enviar OTP por correo electrónico
      await this.emailService.sendOTP(user.name, email, otp);

      return {
        userId: user.id,
      };
    } catch (e) {
      const error = <Error>e;
      throw new Error(error.message);
    }
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    try {
      // Buscar el ultimo OTP del usuario en la base de datos
      const otpRecord = await OTP.findOne({
        where: { userId },
        order: [['id', 'DESC']],
      });

      if (!otpRecord) {
        throw new Error('OTP not found');
      }

      // Verificar si el OTP es correcto
      if (otpRecord.get('otpCode') === otp) {
        // Borrar todos OTP del usuario de la base de datos
        await OTP.destroy({ where: { userId } });
        return true;
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (e) {
      const error = <Error>e;
      throw new Error(error.message);
    }
  }
}

export { AuthService };
