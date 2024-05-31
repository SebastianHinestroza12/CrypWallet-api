import jwt, { SignOptions } from 'jsonwebtoken';
import { UserAttributes } from '../types';

const { JWT_SECRET_KEY } = process.env;

if (!JWT_SECRET_KEY) {
  throw new Error('Please make sure that all necessary environment variables are set.');
}

const generateToken = (user: UserAttributes): string => {
  const { id, email, name } = user;
  const options: SignOptions = {
    expiresIn: '5h',
  };
  return jwt.sign({ id, email, name }, JWT_SECRET_KEY, options);
};

const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

export { generateToken, verifyToken };
