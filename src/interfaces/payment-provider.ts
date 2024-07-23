/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaymentProvider<T> {
  createPayment(sessionData: any): Promise<T>;
}

export interface PreferenceData {
  body: {
    items: {
      id: string;
      title: string;
      picture_url: string;
      quantity: number;
      currency_id: string;
      unit_price: number;
    }[];
    payer: {
      email: string;
    };
    back_urls: {
      success: string;
      failure: string;
      pending: string;
    };
    auto_return: string;
  };
}