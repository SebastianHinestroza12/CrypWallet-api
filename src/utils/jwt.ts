import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { ITokenService } from '../interfaces/Authentication';
import { UserAttributes } from '../types';
import { getEnvVariable } from './env';

const JWT_SECRET_KEY = getEnvVariable('JWT_SECRET_KEY');

export class JwtTokenService implements ITokenService {
  generateToken(user: UserAttributes): string {
    const { id, email, name } = user;
    const options: SignOptions = {
      expiresIn: '5h',
    };
    return jwt.sign({ id, email, name }, JWT_SECRET_KEY, options);
  }

  verifyToken(token: string): JwtPayload | boolean {
    return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  }
}
