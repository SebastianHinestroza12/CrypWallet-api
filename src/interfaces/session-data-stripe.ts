export interface SessionData {
  line_items: LineItem[];
  mode: 'payment' | 'subscription' | 'setup';
  customer_email: string;
  payment_method_types: string[];
  success_url: string;
  cancel_url: string;
}

export interface ProductData {
  name: string;
  images: string[];
}

export interface PriceData {
  currency: string;
  product_data: ProductData;
  unit_amount: number;
}

export interface LineItem {
  price_data: PriceData;
  quantity: number;
}

export interface RequestPaymentStripeIprops {
  nameCrypto: string;
  currency: string;
  unit_amount: number;
  urlImage: string;
  customer_email: string;
}
