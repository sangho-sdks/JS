import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type ReceiptStatus = "draft" | "issued" | "voided" | "archived";

export type PaymentMethodType = "card" | "mobile_money" | "bank_transfer" | "e_wallet";

export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number;
  amount: number;
  currency: "XAF";
}

/**
 * Représente un reçu Sangho.
 * Préfixe d'identifiant : `rec_xxx`
 * Devise fixe : XAF — en lecture seule.
 */
export interface Receipt extends Timestamps {
  id: string;
  object: "receipt";
  app: string;
  number: string;               // ex: REC-20240101-0001
  customer: string;
  transaction?: string | null;
  status: ReceiptStatus;
  payment_method: PaymentMethodType;
  currency: "XAF";
  subtotal: number;
  tax: number;
  total: number;
  shipping_amount: number;
  discount_amount: number;
  items: ReceiptItem[];
  pdf_url?: string | null;
  issue_date: string;           // DateTimeField auto_now_add
  metadata: Metadata;
}

/** Filtres GET /receipts/ */
export interface ReceiptCriteria extends ListParams {
  customer?: string;
  transaction?: string;
  status?: ReceiptStatus;
}