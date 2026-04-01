import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type TransactionStatus =
  | "approved"
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "disputed"
  | "canceled"
  | "cancelled";  // variante backend

export type TransactionType =
  | "deposit"    // paiement entrant (SDK: "payment" mappé → "deposit")
  | "refund"
  | "payout"
  | "withdraw"   // (SDK: "transfer" mappé → "withdraw")
  | "transfer";

/**
 * Représente une transaction Sangho.
 * Préfixe d'identifiant : `trans_xxx`
 * Création impossible via API — résultat d'un PaymentIntent.
 */
export interface Transaction extends Timestamps {
  id: string;
  object: "transaction";
  amount: number;
  fee: number;
  commission: number;
  commission_rate: number;
  currency: "XAF";
  status: TransactionStatus;
  type: TransactionType;
  description?: string | null;
  payment_intent: string;        // FK — ID du PaymentIntent lié
  expiration_date?: string | null;
  processed_at?: string | null;
  metadata: Metadata;
}

/** Champs PATCH — uniquement description + metadata */
export interface Payloads {
  description?: string;
  metadata?: Metadata;
}

/** Filtres GET /transactions/ — alignés sur get_queryset() */
export interface TransactionCriteria extends ListParams {
  status?: TransactionStatus;
  type?: TransactionType;
  created_after?: string;
  created_before?: string;
  min_amount?: number;
  max_amount?: number;
  // search → description__icontains (hérité ListParams)
}