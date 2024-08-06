import { JwtTokenService } from '../utils';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import status from 'http-status';

interface CustomRequest extends Request {
  user?: string | boolean | JwtPayload;
}

class AuthMiddleware {
  private excludedPaths: RegExp[];

  constructor() {
    this.excludedPaths = [
      /^\/api\/v1\/auth\/login$/,
      /^\/api\/v1\/auth\/register$/,
      /^\/api\/v1\/auth\/verify-email$/,
      /^\/api\/v1\/auth\/generate-otp$/,
      /^\/api\/v1\/auth\/[\w-]+\/verify-otp$/,
      /^\/api\/v1\/auth\/verify-safe-words$/,
      /^\/api\/v1\/cryptocurrencies$/,
      /^\/api\/v1\/transaction\/types$/,
      /^\/api\/v1\/auth\/users\/[\w-]+\/update-password$/,
      /^\/api\/v1\/auth\/profile\/update\/[\w-]+$/,
    ];
  }

  middleware(req: CustomRequest, res: Response, next: NextFunction): Response | void {
    if (this.shouldExcludePath(req.path)) {
      return next();
    }

    const { token } = req.cookies;

    if (!token || typeof token !== 'string') {
      return res.status(status.UNAUTHORIZED).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const verify = new JwtTokenService();
      const decoded = verify.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(status.UNAUTHORIZED).json({ message: 'Unauthorized access' });
    }
  }

  private shouldExcludePath(path: string): boolean {
    return this.excludedPaths.some((regex) => regex.test(path));
  }
}

export { AuthMiddleware };
