import { AuthService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserAttributes, RegisterUserAttributes } from '../types';
import { SafeWordsService } from '../services/safeWord.service';
import { VerifySafeWordsRequestBody, UpdatePassword } from '../interfaces';
import { WalletService } from '../services/wallet.service';
import { BcryptHashService, JwtTokenService } from '../utils';
import { sequelize } from '../database';
import status from 'http-status';

const hashService = new BcryptHashService();
const tokenService = new JwtTokenService();
const authService = new AuthService(hashService, tokenService);

class AuthController {
  static readonly register = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body as UserAttributes;
      const token = await authService.login(email, password);
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 5 * 60 * 60 * 1000,
      });
      return res.status(status.OK).json({
        login: true,
        message: 'User logged in successfully',
      });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.NOT_FOUND).json({ message: error.message });
    }
  };

  static readonly verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
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
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
      const { userId, words } = req.body;
      await authService.verifySafeWords(userId, words);
      return res.status(status.OK).json({
        status: true,
        menssage: 'Safeword verification successful!!',
      });
    } catch (e) {
      const error = <Error>e;
      return res.status(status.NOT_FOUND).json({ message: error.message });
    }
  };

  static readonly changePassword = async (
    req: Request<unknown, unknown, UpdatePassword>,
    res: Response,
  ) => {
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
      const { id } = req.params as UpdatePassword;
      const { newPassword, repiteNewPassword } = req.body;
      await authService.updateUserPassword(id, newPassword, repiteNewPassword);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
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
}

export { AuthController };
