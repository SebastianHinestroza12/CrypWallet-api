/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import { getEnvVariable } from '../utils';
import { PaymentProvider } from '../interfaces/payment-provider';
import { RequestPaymentStripeIprops, SessionData } from '../interfaces/session-data-stripe';

const stripeApiKey = getEnvVariable('STRIPE_API_KEY');
const stripe = new Stripe(stripeApiKey);

export class StripePaymentProvider implements PaymentProvider<Stripe.Checkout.Session> {
  async createPayment(sessionData: any): Promise<Stripe.Checkout.Session> {
    const { nameCrypto, currency, unit_amount, urlImage, customer_email, paymentMethod } =
      sessionData as RequestPaymentStripeIprops;
    const amountInCents = Math.round(unit_amount * 100);

    const sessionDataStripe: SessionData = {
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
      success_url: `http://localhost:3000/success-payment?from=${paymentMethod}`,
      cancel_url: 'http://localhost:3000/cancel-payment',
    };
    try {
      const session = await stripe.checkout.sessions.create(
        sessionDataStripe as Stripe.Checkout.SessionCreateParams,
      );
      return session;
    } catch (error) {
      throw new Error('Failed to process payment with Stripe');
    }
  }
}
