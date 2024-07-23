import { AuthService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { UserAttributes, RegisterUserAttributes } from '../types';
import { SafeWordsService } from '../services/safeWord.service';
import { VerifySafeWordsRequestBody, UpdatePassword } from '../interfaces';
import { VerifyOTPPayload } from '../interfaces/Authentication';
import { WalletService } from '../services/wallet.service';
import { BcryptHashService, JwtTokenService, GenerateOTP } from '../utils';
import { sequelize } from '../database';
import { EmailService } from '../services/email.service';
import { validateData } from '../helper/validateData';
import status from 'http-status';

const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();
const emailService = new EmailService();
const generateOtp = new GenerateOTP();
const authService = new AuthService(hashService, tokenService, emailService, generateOtp);

class AuthController {
  static readonly register = async (req: Request, res: Response, next: NextFunction) => {
    validateData(req, res);
    const { email, name, lastName, password } = req.body as RegisterUserAttributes;
    const transaction = await sequelize.transaction();

    try {
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(status.CONFLICT).json({ message: 'User already exists' });
      }
      const nameDefaultWallet = 'Main Wallet 1';
      const user = await authService.register({ name, lastName, email, password }, transaction);
      const safeWords = await SafeWordsService.saveSafeWordsByUser(user.id, transaction);
      const createWallet = await WalletService.createWallet(
        user.id,
        nameDefaultWallet,
        transaction,
      );
      await transaction.commit();
      return res.status(status.CREATED).json({
        message: 'User created successfully',
        user,
        wallet: createWallet,
        safeWords: safeWords.words,
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  static readonly login = async (req: Request, res: Response) => {
    validateData(req, res);
    try {
      const { email, password } = req.body as UserAttributes;
      const { token, user } = await authService.login(email, password);
      const getWalletsUser = await WalletService.getWalletByUserId(user.id);
      const safeWordByUser = await SafeWordsService.getSafeWordsById(user.id);

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 5 * 60 * 60 * 1000, // 5 hours
      });
      return res.status(status.OK).json({
        login: true,
        message: 'User logged in successfully',
        user,
        wallets: getWalletsUser,
        safeWords: safeWordByUser?.words,
      });
    } catch (e) {
      const error = <Error>e;
      if (error.message === 'Incorrect password') {
        return res.status(status.UNAUTHORIZED).json({ message: 'Incorrect password' });
      }
      if (error.message === 'locked account') {
        return res
          .status(status.FORBIDDEN)
          .json({ message: 'Your account has been locked due to too many failed login attempts' });
      }

      return res.status(status.NOT_FOUND).json({ message: error.message });
    }
  };

  static readonly verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    validateData(req, res);
    try {
      const { email } = req.body as UserAttributes;
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(status.NOT_FOUND).json({ message: 'User not found' });
      }
      return res.status(status.OK).json({
        registered: true,
        user,
      });
    } catch (e) {
      next(e);
    }
  };

  static readonly verifySafeWords = async (
    req: Request<unknown, unknown, VerifySafeWordsRequestBody>,
    res: Response,
  ) => {
    validateData(req as Request, res);
    try {
      const { userId, words } = req.body;
      await authService.verifySafeWords(userId, words);
      return res.status(status.OK).json({
        status: true,
        menssage: 'Safeword verification successful!!',
      });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.BAD_REQUEST).json({ message: error.message });
    }
  };

  static readonly changePassword = async (
    req: Request<unknown, unknown, UpdatePassword>,
    res: Response,
  ) => {
    validateData(req as Request, res);
    try {
      const { id } = req.params as UpdatePassword;
      const { newPassword } = req.body;
      await authService.updateUserPassword(id, newPassword);
      return res.status(status.OK).json({
        message: 'Password updated successfully',
      });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.BAD_REQUEST).json({ message: error.message });
    }
  };

  static readonly logout = (req: Request, res: Response) => {
    try {
      res.clearCookie('token');
      return res.status(status.OK).json({ message: 'Logout successful' });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.BAD_REQUEST).json({ message: error.message });
    }
  };

  static readonly updateProfile = async (req: Request, res: Response) => {
    validateData(req, res);
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const userData = req.body as UserAttributes;
      const profile = await authService.updateUserById(id, userData, transaction);
      await transaction.commit();
      return res.status(status.OK).json({ message: 'Profile updated successfully', user: profile });
    } catch (e) {
      await transaction.rollback();
      const error = <Error>e;
      return res.status(status.BAD_REQUEST).json({ message: error.message });
    }
  };

  static readonly generateOTP = async (req: Request, res: Response, next: NextFunction) => {
    validateData(req, res);
    const { email } = req.body as UserAttributes;
    const transaction = await sequelize.transaction();
    try {
      const { userId } = await authService.generateAndSendOTP(email, transaction);
      await transaction.commit();
      return res.status(status.OK).json({ message: 'OTP sent successfully', userId });
    } catch (e) {
      const error = <Error>e;
      await transaction.rollback();
      if (error.message === 'User not found') {
        return res.status(status.NOT_FOUND).json({ message: 'User not found' });
      }
      next(e);
    }
  };

  static readonly verifyOTP = async (req: Request, res: Response) => {
    validateData(req, res);
    const { id } = req.params;
    const { otp } = req.body as VerifyOTPPayload;

    try {
      await authService.verifyOTP(id, otp);
      return res.status(status.OK).json({
        message: 'OTP verified successfully',
      });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.BAD_REQUEST).json({ message: error.message });
    }
  };
}

export { AuthController };
