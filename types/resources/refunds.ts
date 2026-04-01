import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type RefundStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "expired";

export type RefundReason =
  | "duplicate"
  | "fraudulent"
  | "customer_request"
  | "product_issue"
  | "service_not_rendered";

/** Représente un remboursement Sangho. Préfixe : `refd_xxx` */
export interface Refund extends Timestamps {
  id: string;
  object: "refund";
  transaction: string;       // ID trans_xxx — résolu par le serializer
  amount: number;
  currency: "XAF";
  status: RefundStatus;
  reason?: RefundReason | null;
  description?: string | null;
  failure_reason?: string | null;
  metadata: Metadata;
}

/** Champs POST */
export interface CreatePayloads {
  transaction: string;       // ID trans_xxx
  amount?: number;           // partiel si < montant original
  reason?: RefundReason;
  description?: string;
  metadata?: Metadata;
}

/** Filtres GET /refunds/ */
export interface RefundCriteria extends ListParams {
  transaction?: string;
  status?: RefundStatus;
  reason?: RefundReason;
}