import { CryptoService } from '../services/crypto.service';
import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../database';
import status from 'http-status';

class CryptoController {
  static readonly createCrypto = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
      const crypto = await CryptoService.createCrytoCurerncy(transaction);
      await transaction.commit();
      return res.status(status.OK).json(crypto);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  static readonly getAllCrypto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const crypto = await CryptoService.getAllCrypto();
      return res.status(status.OK).json({ crypto });
    } catch (error) {
      next(error);
    }
  };
}

export { CryptoController };
