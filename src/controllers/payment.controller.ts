/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// controllers/payment.controller.ts
import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { PaymentService } from '../services/payment.service';
import { StripePaymentProvider } from '../provider/stripe-payment-provider';
import { SessionData, RequestPaymentStripeIprops } from '../interfaces/session-data-stripe';
import { validateData } from '../helper/validateData';

const paymentProvider = new StripePaymentProvider();
const paymentService = new PaymentService(paymentProvider);

export class PaymentController {
  static readonly createStripePayment = async (req: Request, res: Response, next: NextFunction) => {
    validateData(req, res);
    const { nameCrypto, currency, unit_amount, urlImage, customer_email } =
      req.body as RequestPaymentStripeIprops;
    const amountInCents = Math.round(unit_amount * 100);

    const sessionData: SessionData = {
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: nameCrypto,
              images: [urlImage],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email,
      payment_method_types: ['card'],
      success_url: 'http://localhost:3000/success-payment?from=stripe',
      cancel_url: 'http://localhost:3000/cancel-payment',
    };

    try {
      const paymentWithStripe = await paymentService.createPayment(sessionData);

      return res.status(status.OK).json({
        message: 'Payment created successfully',
        data: paymentWithStripe,
      });
    } catch (error) {
      next(error);
    }
  };
}
