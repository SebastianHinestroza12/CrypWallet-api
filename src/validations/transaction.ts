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
