import { body, ValidationChain } from 'express-validator';

export const validateSend = (): ValidationChain[] => {
  return [
    body('amount').trim().notEmpty().withMessage('amount is required').isNumeric(),
    body('cryptocurrencyId')
      .trim()
      .notEmpty()
      .withMessage('cryptocurrencyId is required')
      .isString()
      .isUppercase(),
    body('destinyWalletId').trim().notEmpty().withMessage('destinyWalletId is required').isString(),
    body('originWalletId').trim().notEmpty().withMessage('originWalletId is required').isString(),
    body('description').optional().trim().isString(),
  ];
};
