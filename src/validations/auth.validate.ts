import { body, ValidationChain } from 'express-validator';

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

const passwordValidation = (): ValidationChain => {
  return body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6, max: 6 })
    .withMessage('Password must be exactly 6 characters long')
    .matches(/^[0-9]+$/)
    .withMessage('Password must contain only numbers');
};

const validateUserRegistration = (): ValidationChain[] => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Name must contain a minimum of 3 characters and a maximum of 20'),

    body('lastName')
      .trim()
      .isString()
      .withMessage('Numbers are not accepted, only letters')
      .isLength({ min: 3, max: 20 })
      .withMessage('Last name must contain a minimum of 3 characters and a maximum of 20'),

    emailValidation(),
    passwordValidation(),
  ];
};

const validateUserLogin = (): ValidationChain[] => {
  return [emailValidation(), passwordValidation()];
};

export { validateUserRegistration, validateUserLogin };
