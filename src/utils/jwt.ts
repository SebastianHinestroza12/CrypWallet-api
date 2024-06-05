import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { ITokenService } from '../interfaces/Authentication';
import { UserAttributes } from '../types';

const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET_KEY) {
  throw new Error('Please make sure that all necessary environment variables are set.');
}
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
