/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PaymentProvider, PreferenceData } from '../interfaces/payment-provider';
import { getEnvVariable } from '../utils';
import { RequestPaymentStripeIprops } from '../interfaces/session-data-stripe';

const mercadoPagoApiKey = getEnvVariable('MERCADO_PAGO_API_KEY');

const client = new MercadoPagoConfig({ accessToken: mercadoPagoApiKey });

export class MercadoPagoPaymentProvider implements PaymentProvider<any> {
  async createPayment(sessionData: any): Promise<any> {
    const preference = new Preference(client);
    const { nameCrypto, currency, unit_amount, urlImage, customer_email, paymentMethod } =
      sessionData as RequestPaymentStripeIprops;

    const amountInCents = Math.round(unit_amount * 100);

    const preferenceData: PreferenceData = {
      body: {
        items: [
          {
            id: nameCrypto,
            title: nameCrypto,
            picture_url: urlImage,
            quantity: 1,
            currency_id: currency.toUpperCase(),
            unit_price: amountInCents,
          },
        ],
        payer: {
          email: customer_email,
        },
        back_urls: {
          success: `http://localhost:3000/success-payment?from=${paymentMethod}`,
          failure: 'http://localhost:3000/cancel-payment',
          pending: '',
        },
        auto_return: 'approved',
      },
    };

    try {
      const session = await preference.create(preferenceData);
      return session;
    } catch (e) {
      const error = <Error>e;
      console.log(error.message);
      throw new Error(`Failed to process payment with Mercado Pago: ${error.message}`);
    }
  }
}
