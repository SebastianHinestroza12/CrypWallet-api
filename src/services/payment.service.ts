/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { PaymentProvider } from '../interfaces/payment-provider';

export class PaymentService<T> {
  constructor(private paymentProvider: PaymentProvider<T>) {}

  async createPayment(sessionData: any) {
    return this.paymentProvider.createPayment(sessionData);
  }
}
