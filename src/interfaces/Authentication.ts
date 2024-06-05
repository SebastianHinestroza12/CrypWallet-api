/* eslint-disable no-unused-vars */
import { UserAttributes } from '../types';
import { JwtPayload } from 'jsonwebtoken';

interface IHashService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

interface ITokenService {
  generateToken(user: UserAttributes): string;
  verifyToken(token: string): JwtPayload | string | boolean;
}

export { IHashService, ITokenService };
