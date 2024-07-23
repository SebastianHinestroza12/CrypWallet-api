/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionData } from './session-data-stripe';
import { StripeResponse } from './stripe-response';

export interface PaymentProvider {
  createPayment(sessionData: SessionData): Promise<StripeResponse>;
}
