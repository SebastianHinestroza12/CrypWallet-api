import { body, param, ValidationChain } from 'express-validator';

const emailValidation = (): ValidationChain => {
  return body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isString()
    .withMessage('Must be a string')
    .isEmail()
    .withMessage('It must be in email format, example: example@example.com')
    .normalizeEmail();
};

const nameLastNameValidation = (): ValidationChain[] => {
  return [
    body('name')
      .trim()
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must contain a minimum of 3 characters and a maximum of 20')
      .optional(),
    body('lastName')
      .trim()
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Last name must contain a minimum of 3 characters and a maximum of 20')
      .optional(),
  ];
};

const passwordValidation = (attribute: string): ValidationChain => {
  const attr: string = attribute.toUpperCase();
  return body(attribute)
    .trim()
    .notEmpty()
    .withMessage(`${attr} is required`)
    .isString()
    .withMessage(`${attr} must be a string`)
    .isLength({ min: 6, max: 6 })
    .withMessage(`${attr} must be exactly 6 characters long`)
    .matches(/^\d+$/)
    .withMessage(`${attr} must contain only numbers`);
};

const validateUserRegistration = (): ValidationChain[] => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('name is required')
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must contain a minimum of 3 characters and a maximum of 20'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('lastName is required')
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Last name must contain a minimum of 3 characters and a maximum of 20'),
    emailValidation(),
    passwordValidation('password'),
  ];
};

const validateUserLogin = (): ValidationChain[] => {
  return [emailValidation(), passwordValidation('password')];
};

const validateEmail = (): ValidationChain[] => {
  return [emailValidation()];
};

const validateChangePassword = (): ValidationChain[] => {
  return [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('id is required')
      .isString()
      .isUUID()
      .withMessage('Must be in UUID format'),
    passwordValidation('newPassword'),
  ];
};

const verifyOTP = (): ValidationChain[] => {
  return [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('id is required')
      .isString()
      .isUUID()
      .withMessage('Must be in UUID format'),
    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP is required')
      .isString()
      .withMessage('OTP must be a string')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be exactly 6 characters long'),
  ];
};
export {
  validateUserRegistration,
  validateUserLogin,
  validateEmail,
  validateChangePassword,
  nameLastNameValidation,
  verifyOTP,
};
