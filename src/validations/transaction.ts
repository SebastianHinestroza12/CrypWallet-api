import { body, ValidationChain, param } from 'express-validator';

export const validateSend = (): ValidationChain[] => {
  return [
    body('amount').trim().notEmpty().withMessage('amount is required').isNumeric(),
    body('cryptocurrencyId')
      .trim()
      .notEmpty()
      .withMessage('cryptocurrencyId is required')
      .isString()
      .isUppercase(),
    body('destinyWalletId')
      .trim()
      .notEmpty()
      .withMessage('destinyWalletId is required')
      .isString()
      .isUUID(),
    body('originWalletId')
      .trim()
      .notEmpty()
      .withMessage('originWalletId is required')
      .isString()
      .isUUID(),
    body('description').optional().trim().isString(),
  ];
};

export const validateSwap = (): ValidationChain[] => {
  return [
    body().isArray({ min: 2, max: 2 }).withMessage('Body must be an array with exactly 2 elements'),

    body('*.id')
      .trim()
      .notEmpty()
      .withMessage('id is required')
      .isString()
      .withMessage('id must be a string')
      .isUppercase()
      .withMessage('id must be uppercase'),

    body('*.type')
      .trim()
      .notEmpty()
      .withMessage('type is required')
      .isString()
      .withMessage('type must be a string')
      .isIn(['increment', 'decrement'])
      .withMessage('type must be either increment or decrement'),

    body('*.amount')
      .notEmpty()
      .withMessage('amount is required')
      .isNumeric()
      .withMessage('amount must be a number')
      .custom((value) => value > 0)
      .withMessage('amount must be greater than 0')
      .custom((value) => value >= 0.001)
      .withMessage('amount must be at least 0.001'),

    body('*.walletId')
      .trim()
      .notEmpty()
      .withMessage('walletId is required')
      .isString()
      .withMessage('walletId must be a string')
      .isUUID()
      .withMessage('walletId must be a valid UUID'),
  ];
};

export const validateCryptoPurchase = (): ValidationChain[] => {
  return [
    body('amount').trim().notEmpty().withMessage('amount is required').isNumeric(),
    body('cryptoID').trim().notEmpty().withMessage('cryptoID is required').isString(),
    body('idPayment').trim().notEmpty().withMessage('idPayment is required').isString(),
    body('paymentGateway').trim().notEmpty().withMessage('paymentGateway is required').isString(),
    body('originWalletId')
      .trim()
      .notEmpty()
      .withMessage('originWalletId is required')
      .isString()
      .isUUID(),
  ];
};

export const userIdValidate = (): ValidationChain[] => {
  return [
    param('userId')
      .trim()
      .notEmpty()
      .withMessage('userId is required')
      .isString()
      .isUUID()
      .withMessage('Must be in UUID format'),
  ];
};
