/* eslint-disable no-unused-vars */
// services/payment.service.ts
import { SessionData } from '../interfaces/session-data-stripe';
import { PaymentProvider } from '../interfaces/payment-provider';

export class PaymentService {
  constructor(private paymentProvider: PaymentProvider) {}

  async createPayment(sessionData: SessionData) {
    return this.paymentProvider.createPayment(sessionData);
  }
}
