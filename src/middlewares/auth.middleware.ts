import { verifyToken } from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import status from 'http-status';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const excludedPaths = [
    /^\/api\/v1\/auth\/login$/,
    /^\/api\/v1\/auth\/register$/,
    /^\/api\/v1\/auth\/verify-email$/,
    /^\/api\/v1\/auth\/verify-safe-words$/,
    /^\/api\/v1\/cryptocurrencies$/,
    /^\/api\/v1\/auth\/users\/[\w-]+\/update-password-with-safe-words$/,
  ];

  if (excludedPaths.some((regex) => regex.test(req.path))) {
    return next();
  }

  const { token } = req.cookies;

  if (!token || typeof token !== 'string') {
    return res.status(status.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized access' });
  }
};

export { authMiddleware };
