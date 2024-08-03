/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { validateRequestPayment } from '../validations/payment.validate';

const paymentRoutes = Router();

paymentRoutes.post(
  '/create-checkout-session',
  validateRequestPayment(),
  PaymentController.createPayment,
);

export { paymentRoutes };
