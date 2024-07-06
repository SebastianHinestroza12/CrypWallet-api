import { body, param, ValidationChain } from 'express-validator';

const validateUUID = (field: string, location: 'body' | 'param'): ValidationChain => {
  const validator = location === 'body' ? body : param;
  return validator(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isString()
    .isUUID()
    .withMessage('Must be in UUID format');
};

const validateUserIdParam = (): ValidationChain => validateUUID('userId', 'param');

const validateParamsId = (): ValidationChain => validateUUID('id', 'param');

const validateWalletId = (): ValidationChain[] => [validateUserIdParam(), validateParamsId()];

const paramsIdValidation = (): ValidationChain[] => [validateParamsId()];
export { validateWalletId, paramsIdValidation };
