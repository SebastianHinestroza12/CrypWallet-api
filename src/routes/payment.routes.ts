/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { validateRequestPaymentStripe } from '../validations/payment.validate';

const paymentRoutes = Router();

paymentRoutes.post(
  '/create-checkout-session',
  validateRequestPaymentStripe(),
  PaymentController.createStripePayment,
);

export { paymentRoutes };
