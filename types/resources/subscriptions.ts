import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "paused"
  | "canceled"
  | "unpaid"
  | "expired";

export type BillingInterval = "day" | "week" | "month" | "year";
export type CollectionMethod = "charge_automatically" | "send_invoice";

/**
 * Représente un abonnement Sangho.
 * Préfixe d'identifiant : `sub_xxx`
 */
export interface Subscription extends Timestamps {
  id: string;
  object: "subscription";
  app: string;
  customer: string;
  status: SubscriptionStatus;
  currency: "XAF";
  unit_amount: number;
  interval: BillingInterval;
  interval_count: number;
  collection_method: CollectionMethod;
  current_period_start: string;
  current_period_end: string;
  trial_start?: string | null;
  trial_end?: string | null;
  canceled_at?: string | null;
  cancel_at_period_end: boolean;
  product?: string | null;
  payment_method?: string | null;
  metadata: Metadata;
}

/** Champs POST */
export interface CreatePayloads {
  customer: string;
  unit_amount: number;
  interval: BillingInterval;
  interval_count?: number;
  product?: string;
  payment_method?: string;
  collection_method?: CollectionMethod;
  trial_period_days?: number;
  cancel_at_period_end?: boolean;
  metadata?: Metadata;
}

/** Champs PATCH */
export interface Payloads {
  unit_amount?: number;
  payment_method?: string;
  collection_method?: CollectionMethod;
  cancel_at_period_end?: boolean;
  metadata?: Metadata;
}

/** Filtres GET /subscriptions/ */
export interface SubscriptionCriteria extends ListParams {
  customer?: string;
  status?: SubscriptionStatus;
  currency?: string;
}