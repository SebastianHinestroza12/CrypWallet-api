/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import { getEnvVariable } from '../utils';
import { PaymentProvider } from '../interfaces/payment-provider';

const stripeApiKey = getEnvVariable('STRIPE_API_KEY');
const stripe = new Stripe(stripeApiKey);

export class StripePaymentProvider implements PaymentProvider {
  async createPayment(sessionData: any): Promise<any> {
    try {
      const session = await stripe.checkout.sessions.create(sessionData);
      return session;
    } catch (error) {
      throw new Error('Failed to process payment with Stripe');
    }
  }
}
