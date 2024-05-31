import { verifyToken } from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): Response | void => {
  const excludedPaths = ['/api/v1/auth/login', '/api/v1/auth/register'];

  if (excludedPaths.includes(req.path)) {
    return next();
  }

  const { token } = req.cookies;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

export { authMiddleware };
