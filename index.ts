// =============================================================================
// sangho-sdk-js — Point d'entrée public
// N'exporte que ce qui est utile à l'intégrateur.
// =============================================================================

// ─── Client principal ─────────────────────────────────────────────────────────
export { Sangho } from "./client";
export { Sangho as default } from "./client";

// ─── Erreurs (pour les catch typés) ──────────────────────────────────────────
export {
  SanghoError,
  SanghoAuthError,
  SanghoPublicKeyError,
  SanghoPermissionError,
  SanghoNotFoundError,
  SanghoValidationError,
  SanghoRateLimitError,
  SanghoIdempotencyError,
  SanghoNetworkError,
  SanghoTimeoutError,
} from "./core/errors";
export type { SanghoErrorCode, SanghoErrorResponse } from "./core/errors";

// ─── Types communs ────────────────────────────────────────────────────────────
export type {
  ListParams,
  ListResponse,
  Timestamps,
  AmountInCents,
  CurrencyCode,
  Address,
  Metadata,
  SanghoOptions,
} from "./types/common";

// ─── Types de ressources ──────────────────────────────────────────────────────
export type {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  CustomerListParams
} from "./types/resources/customers";
export type {
  Product,
  ProductImage,
  CreateProductParams,
  UpdateProductParams,
  ProductListParams
} from "./types/resources/products";
export type {
  PaymentIntent,
  CreatePaymentIntentParams,
  UpdatePaymentIntentParams,
  ConfirmPaymentIntentParams,
  CapturePaymentIntentParams,
  CancelPaymentIntentParams,
  PaymentIntentListParams,
} from "./types/resources/payment-intents";
export type {
  Transaction,
  TransactionListParams,
} from "./types/resources/transactions";
export type {
  Refund,
  CreateRefundParams,
  RefundListParams,
} from "./types/resources/refunds";
export type {
  Invoice,
  CreateInvoiceParams,
  UpdateInvoiceParams,
  InvoiceListParams,
} from "./types/resources/invoices";
export type {
  PaymentLink,
  CreatePaymentLinkParams,
  UpdatePaymentLinkParams,
  PaymentLinkListParams,
} from "./types/resources/payment-links";
export type {
  CheckoutSession,
  CreateCheckoutSessionParams,
  CheckoutSessionListParams,
} from "./types/resources/checkout-sessions";
export type {
  Subscription,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  SubscriptionListParams,
} from "./types/resources/subscriptions";
export type {
  PaymentMethod,
  AttachPaymentMethodParams,
  PaymentMethodListParams,
} from "./types/resources/payment-methods";
export type {
  Receipt,
  ReceiptListParams,
} from "./types/resources/receipts";
export type {
  Webhook,
  WebhookDelivery,
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookListParams,
  WebhookDeliveryListParams,
} from "./types/resources/webhooks";
export type {
  SecurityProfile,
  UpdateSecurityProfileParams,
} from "./types/resources/security";
export type {
  Partner,
  PartnerListParams,
} from "./types/resources/partners";

// ─── Utilitaires ─────────────────────────────────────────────────────────────
export { constructEvent } from "./utils/webhook";
