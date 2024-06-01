import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import status from 'http-status';

export const validateData = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.BAD_REQUEST).json({ errors: errors.array() });
  }
};
