import { body, ValidationChain } from 'express-validator';

const validateSafeWords = (): ValidationChain[] => {
  return [
    body('userId')
      .trim()
      .notEmpty()
      .withMessage('UserId is required')
      .isString()
      .isUUID()
      .withMessage('Must be in UUID format'),

    body('words')
      .trim()
      .notEmpty()
      .withMessage('words is required')
      .isArray({ min: 12, max: 12 })
      .withMessage('Words must be an array with exactly 12 elements')
      .bail()
      .custom((arr) => {
        if (!Array.isArray(arr)) {
          throw new Error('Words must be an array');
        }

        const allStrings = arr.every((word) => typeof word === 'string');
        if (!allStrings) {
          throw new Error('All elements in words must be strings');
        }

        return true;
      }),
  ];
};

export { validateSafeWords };
