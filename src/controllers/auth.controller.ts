import { AuthService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserAttributes, RegisterUserAttributes } from '../types';
import { SafeWordsService } from '../services/safeWord.service';
import { sequelize } from '../database';
import { VerifySafeWordsRequestBody, UpdatePassword } from '../interfaces';
import status from 'http-status';
import { WalletService } from '../services/wallet.service';

class AuthController {
  static readonly register = async (req: Request, res: Response, next: NextFunction) => {
    //Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { email, name, lastName, password } = req.body as RegisterUserAttributes;

    const transaction = await sequelize.transaction();

    try {
      //Verificar si el usuario ya existe
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser) {
        return res.status(status.CONFLICT).json({ message: 'User already exists' });
      }

      //Registtrar al usuario
      const user = await AuthService.register({ name, lastName, email, password }, transaction);

      //Crear las palabras de seguridad para el usuario
      const safeWords = await SafeWordsService.saveSafeWordsByUser(user.id, transaction);

      //Crear la billetera inicial del usuario
      const createWallet = await WalletService.createWallet(user.id, transaction);

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
    //Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body as UserAttributes;
      const token = await AuthService.login(email, password);
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

  static readonly verifyEmail = async <T>(req: Request, res: Response): Promise<T> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() }) as unknown as T;
    }
    try {
      const { email } = req.body as UserAttributes;
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      return res.status(status.OK).json({
        registered: true,
        user,
      }) as unknown as T;
    } catch (e) {
      const error = <Error>e;
      return res.status(status.NOT_FOUND).json({ message: error.message }) as unknown as T;
    }
  };

  static readonly verifySafeWords = async <T>(
    req: Request<unknown, unknown, VerifySafeWordsRequestBody>,
    res: Response,
  ): Promise<T> => {
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() }) as unknown as T;
    }
    try {
      const { userId, words } = req.body;

      const safeWords = await AuthService.verifySafeWords(userId, words);
      return res.status(status.OK).json({
        status: safeWords,
        menssage: 'Safeword verification successful!!',
      }) as unknown as T;
    } catch (e) {
      const error = <Error>e;
      return res.status(status.NOT_FOUND).json({ message: error.message }) as unknown as T;
    }
  };

  static readonly updateUserPassword = async (
    req: Request<unknown, unknown, UpdatePassword>,
    res: Response,
  ) => {
    const errors = validationResult(req as Request);
    if (!errors.isEmpty()) {
      return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
      const { userId, newPassword, repiteNewPassword } = req.body;
      await AuthService.updateUserPassword(userId, newPassword, repiteNewPassword);
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
}

export { AuthController };
