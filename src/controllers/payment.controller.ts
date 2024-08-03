/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// controllers/payment.controller.ts
import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { PaymentService } from '../services/payment.service';
import { StripePaymentProvider } from '../provider/stripe-payment-provider';
import { RequestPaymentStripeIprops } from '../interfaces/session-data-stripe';
import { validateData } from '../helper/validateData';
import { PaymentProvider } from '../interfaces/payment-provider';
import { MercadoPagoPaymentProvider } from '../provider/mercado-pago-payment.provider';

export class PaymentController {
  static readonly createPayment = async (req: Request, res: Response, next: NextFunction) => {
    validateData(req, res);
    const { unit_amount, paymentMethod } = req.body as RequestPaymentStripeIprops;

    if (unit_amount < 1) {
      return res.status(status.BAD_REQUEST).json({
        message: 'Unit amount must be greater than or equal to 1',
      });
    }

    let paymentProvider: PaymentProvider<any>;

    switch (paymentMethod) {
    case 'stripe':
      paymentProvider = new StripePaymentProvider();
      break;
    case 'mercadoPago':
      paymentProvider = new MercadoPagoPaymentProvider();
      break;
    default:
      return res.status(status.BAD_REQUEST).json({ message: 'Unsupported payment method' });
    }

    const paymentService = new PaymentService(paymentProvider);

    try {
      const paymentSession = await paymentService.createPayment(req.body);

      return res.status(status.OK).json({
        message: 'Payment session created successfully',
        data: paymentSession,
      });
    } catch (error) {
      next(error);
    }
  };
}
