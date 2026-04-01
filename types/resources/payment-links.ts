import type {
  AmountInCents,
  CurrencyCode,
  ListParams,
  Metadata,
  Timestamps,
} from "@/types/common";

export type PaymentLinkStatus = "active" | "inactive" | "archived";
export type PaymentLinkType = "product" | "custom" | "donation";
export type PaymentLinkValidityType = "unlimited" | "limited" | "one_time";

export interface PaymentLinkRedirectUrl {
  success?: string;
  cancel?: string;
}

/**
 * Représente un PaymentLink Sangho.
 * `products` contient des IDs string par défaut,
 * ou des objets Product complets si `?expand=products`.
 */
export interface PaymentLink extends Timestamps {
  id: string;
  object: "payment_link";
  name?: string | null;
  description?: string | null;
  url: string;
  status: PaymentLinkStatus;
  currency: CurrencyCode;
  amount: number;             // converti en unité par to_representation()
  full_amount: string;        // formaté ex: "5 000 XAF"
  minimum_amount?: number | null;
  maximum_amount?: number | null;
  tax_amount?: number | null;
  discount_amount?: number | null;
  shipping_amount?: number | null;
  payment_link_type: PaymentLinkType;
  validity_type: PaymentLinkValidityType;
  expires_at?: string | null;
  max_usage?: number | null;
  redirect_url: PaymentLinkRedirectUrl;
  products: string[];         // IDs — objets si ?expand=products
  product_quantity_settings: Record<string, number>;
  custom_fields: unknown[];
  advanced_options: Record<string, unknown>; // clés camelCase (STRUtils)
  metadata: Metadata;
}

/** Champs POST — alignés sur PaymentLinkSerializer + PaymentLinkValidator */
export interface CreatePayloads {
  name?: string;
  description?: string;
  currency: CurrencyCode;
  payment_link_type?: PaymentLinkType;       // défaut: "product"
  products?: string[];                        // IDs — requis si type "product"
  product_quantity_settings?: Record<string, number>;
  amount?: AmountInCents;                     // requis si type != "product"
  minimum_amount?: AmountInCents;
  maximum_amount?: AmountInCents;
  redirect_url?: PaymentLinkRedirectUrl;
  max_usage?: number;
  validity_type?: PaymentLinkValidityType;
  expires_at?: string;
  custom_fields?: unknown[];
  advanced_options?: Record<string, unknown>;
  metadata?: Metadata;
}

/** Champs PATCH — tous optionnels */
export interface Payloads {
  name?: string;
  description?: string;
  currency?: CurrencyCode;
  products?: string[];
  product_quantity_settings?: Record<string, number>;
  amount?: AmountInCents;
  minimum_amount?: AmountInCents;
  maximum_amount?: AmountInCents;
  redirect_url?: PaymentLinkRedirectUrl;
  max_usage?: number | null;
  validity_type?: PaymentLinkValidityType;
  expires_at?: string | null;
  custom_fields?: unknown[];
  advanced_options?: Record<string, unknown>;
  metadata?: Metadata;
}

/** Filtres GET /payment-links/ — alignés sur get_queryset() */
export interface PaymentLinkCriteria extends ListParams {
  status?: PaymentLinkStatus;
  currency?: CurrencyCode;
}