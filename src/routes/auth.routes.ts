/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateUserRegistration, validateUserLogin } from '../validations/auth.validate';

const authRoute = Router();

authRoute.post('/register', validateUserRegistration(), AuthController.register);
authRoute.post('/login', validateUserLogin(), AuthController.login);
authRoute.post('/logout', AuthController.logout);

export { authRoute };
