/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  validateUserRegistration,
  validateUserLogin,
  validateEmail,
  validateUpdatePassword,
} from '../validations/auth.validate';
import { validateSafeWords } from '../validations/safe.words.validate';

const authRoute = Router();

authRoute.post('/register', validateUserRegistration(), AuthController.register);
authRoute.post('/login', validateUserLogin(), AuthController.login);
authRoute.post('/verify-email', validateEmail(), AuthController.verifyEmail);
authRoute.post('/verify-safe-words', validateSafeWords(), AuthController.verifySafeWords);
authRoute.patch('/update-password', validateUpdatePassword(), AuthController.updateUserPassword);

export { authRoute };
