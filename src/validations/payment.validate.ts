import { body, ValidationChain } from 'express-validator';

export const validateRequestPaymentStripe = (): ValidationChain[] => {
  return [
    body('unit_amount').trim().notEmpty().withMessage('unit_amount is required').isNumeric(),
    body('currency').trim().notEmpty().withMessage('currency is required').isString().isLowercase(),
    body('nameCrypto').trim().notEmpty().withMessage('nameCrypto is required').isString(),
    body('urlImage').trim().notEmpty().withMessage('urlImage is required').isString(),
    body('customer_email').trim().notEmpty().isEmail(),
  ];
};
