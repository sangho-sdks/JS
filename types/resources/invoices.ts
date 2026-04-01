import type { ListParams, Metadata, Timestamps } from "@/types/common";

export type InvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "uncollectible"
  | "void";

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unit_amount: number;
  amount: number;           // unit_amount × quantity
  product?: string;
  metadata?: Metadata;
}

/** Ligne à fournir à la création */
export interface CreateLineItem {
  description: string;
  quantity: number;
  unit_amount: number;
  product?: string;
  metadata?: Metadata;
}

/**
 * Représente une facture Sangho.
 * Préfixe d'identifiant : `inv_xxx`
 * Devise fixe : XAF
 */
export interface Invoice extends Timestamps {
  id: string;
  object: "invoice";
  app: string;
  customer: string;
  number: string;           // ex: INV-inv_xxx
  status: InvoiceStatus;
  currency: "XAF";
  subtotal: number;
  tax: number;
  tax_rate?: number | null;
  total: number;
  amount_paid: number;
  amount_remaining: number;
  description?: string | null;
  footer?: string | null;
  line_items: InvoiceLineItem[];
  due_date?: string | null;
  paid_at?: string | null;
  voided_at?: string | null;
  hosted_url?: string | null;  // URLField direct sur le modèle
  pdf_url?: string | null;     // URL du fichier PDF uploadé
  metadata: Metadata;
}

/** Champs POST */
export interface CreatePayloads {
  customer: string;
  line_items: CreateLineItem[];
  description?: string;
  footer?: string;
  due_date?: string;
  tax_rate?: number;
  metadata?: Metadata;
  /** Si true, passe immédiatement en `"open"` et envoie par email */
  send_immediately?: boolean;
}

/** Champs PATCH — uniquement sur factures `draft` */
export interface Payloads {
  description?: string;
  footer?: string;
  due_date?: string;
  tax_rate?: number;
  metadata?: Metadata;
}

/** Filtres GET /invoices/ */
export interface InvoiceCriteria extends ListParams {
  customer?: string;
  status?: InvoiceStatus;
  currency?: string;
  due_date_before?: string;
  due_date_after?: string;
}