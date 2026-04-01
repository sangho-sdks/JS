import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type WebhookEventType =
  | "payment_intent.created" | "payment_intent.succeeded"
  | "payment_intent.payment_failed" | "payment_intent.canceled"
  | "payment_intent.requires_action"
  | "transaction.created" | "transaction.succeeded"
  | "transaction.failed" | "transaction.refunded"
  | "customer.created" | "customer.updated" | "customer.deleted"
  | "invoice.created" | "invoice.paid"
  | "invoice.payment_failed" | "invoice.voided"
  | "subscription.created" | "subscription.updated"
  | "subscription.canceled" | "subscription.trial_ending"
  | "refund.created" | "refund.updated" | "refund.failed"
  | "checkout.session.completed" | "checkout.session.expired"
  | "payout.created" | "payout.paid" | "payout.failed";

export type WebhookStatus = "ACTIVE" | "INACTIVE" | "DISABLED";
export type WebhookSecurityProfile = "HMAC_SHA256" | "JWT" | "BASIC";
export type DeliveryStatus = "pending" | "delivered" | "failed" | "retrying";

export interface WebhookRetryPolicy {
  max_attempts: number;
  backoff_type: "linear" | "exponential";
  initial_delay_seconds: number;
}

/** Représente un webhook Sangho. Préfixe : `wh_xxx` */
export interface Webhook extends Timestamps {
  id: string;
  object: "webhook";
  app: string;
  name: string;
  url: string;
  status: WebhookStatus;
  events: WebhookEventType[];
  security_profile: WebhookSecurityProfile;
  secret_preview: string;       // jamais la valeur complète
  ssl_verification: boolean;
  retry_policy: WebhookRetryPolicy;
  rate_limit: number;
  timeout: number;
  failure_count: number;
  last_delivery_at?: string | null;
  metadata: Metadata;
}

export interface WebhookDelivery extends Timestamps {
  id: string;
  object: "webhook_delivery";
  webhook: string;
  event_type: WebhookEventType | "webhook.test";
  url: string;
  status: DeliveryStatus;
  http_status?: number | null;
  is_successful: boolean;
  attempts: number;
  next_retry_at?: string | null;
  response_body?: string | null;
  response_time_ms?: number | null;
  delivered_at?: string | null;
  metadata: Metadata;
}

/** Champs POST */
export interface CreatePayloads {
  name: string;
  url: string;
  events: WebhookEventType[];
  security_profile?: WebhookSecurityProfile;
  ssl_verification?: boolean;
  retry_policy?: Partial<WebhookRetryPolicy>;
  rate_limit?: number;
  timeout?: number;
  metadata?: Metadata;
}

/** Champs PATCH */
export interface Payloads {
  name?: string;
  url?: string;
  events?: WebhookEventType[];
  status?: WebhookStatus;
  security_profile?: WebhookSecurityProfile;
  ssl_verification?: boolean;
  retry_policy?: Partial<WebhookRetryPolicy>;
  rate_limit?: number;
  timeout?: number;
  metadata?: Metadata;
}

/** Filtres GET /webhooks/ */
export interface WebhookCriteria extends ListParams {
  status?: WebhookStatus;
}

/** Filtres GET /webhooks/:id/deliveries/ */
export interface DeliveryCriteria extends ListParams {
  event_type?: WebhookEventType;
  status?: DeliveryStatus;
}