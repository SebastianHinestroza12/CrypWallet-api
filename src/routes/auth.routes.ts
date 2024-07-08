/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import {
  validateUserRegistration,
  validateUserLogin,
  validateEmail,
  validateChangePassword,
  nameLastNameValidation,
  verifyOTP,
} from '../validations/auth.validate';
import { validateSafeWords } from '../validations/safe.words.validate';

const authRoute = Router();

authRoute.post('/register', validateUserRegistration(), AuthController.register);
authRoute.post('/login', validateUserLogin(), AuthController.login);
authRoute.post('/verify-email', validateEmail(), AuthController.verifyEmail);
authRoute.post('/generate-otp', validateEmail(), AuthController.generateOTP);
authRoute.post('/:id/verify-otp', verifyOTP(), AuthController.verifyOTP);
authRoute.post('/verify-safe-words', validateSafeWords(), AuthController.verifySafeWords);
authRoute.post('/logout', AuthController.logout);
authRoute.put('/profile/update/:id', nameLastNameValidation(), AuthController.updateProfile);
authRoute.patch(
  '/users/:id/update-password-with-safe-words',
  validateChangePassword(),
  AuthController.changePassword,
);
authRoute.patch(
  '/users/:id/update-password-profile',
  validateChangePassword(),
  AuthController.changePassword,
);

export { authRoute };
