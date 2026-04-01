import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type PaymentMethodType = "mobile_money" | "bank_card" | "paypal";
export type MobileMoneyProvider = "orange" | "mtn" | "wave" | "airtel" | "moovv";
export type CardBrand =
  | "visa" | "mastercard" | "amex" | "discover"
  | "jcb" | "unionpay" | "local" | "unknown";

export interface MobileMoneyDetails {
  provider: MobileMoneyProvider;
  phone_masked: string;
  country: string;
}

export interface BankCardDetails {
  brand: CardBrand;
  last4: string;
  exp_month: number;
  exp_year: number;
  cardholder_name?: string;
  funding: "credit" | "debit" | "prepaid" | "unknown";
  country?: string;
}

export interface PayPalDetails {
  payer_id?: string;
}

/** Représente un mode de paiement Sangho. Préfixe : `meth_xxx` */
export interface PaymentMethod extends Timestamps {
  id: string;
  object: "payment_method";
  app: string;
  customer?: string | null;
  type: PaymentMethodType;
  is_default: boolean;
  mobile_money?: MobileMoneyDetails | null;
  bank_card?: BankCardDetails | null;
  paypal?: PayPalDetails | null;
  metadata: Metadata;
}

export interface AttachPayloads {
  customer: string;
}

/** Filtres GET /payment-methods/ */
export interface PaymentMethodCriteria extends ListParams {
  customer?: string;
  type?: PaymentMethodType;
}