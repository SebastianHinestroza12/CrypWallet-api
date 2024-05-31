import { AuthService } from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { UserAttributes } from '../types';

class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await AuthService.register(req.body as UserAttributes);
      return res.status(status.CREATED).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response) => {
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
}

export { AuthController };
