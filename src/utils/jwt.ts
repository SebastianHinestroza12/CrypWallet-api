import jwt, { SignOptions } from 'jsonwebtoken';
import { UserAttributes } from '../types';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Please make sure that all necessary environment variables are set.');
}

const generateToken = (user: UserAttributes): string => {
  const options: SignOptions = {
    expiresIn: '1d',
  };
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, options);
};

const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

export { generateToken, verifyToken };
