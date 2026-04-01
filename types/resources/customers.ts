import type { Address, Timestamps } from "@/types/common";

export type CustomerStatus = "active" | "inactive" | "blocked";

export interface Customer extends Timestamps {
  id: string;
  object: "customer";
  app: string;
  email: string;
  name: string;
  phone?: string | null;
  address?: Address | null;
  status: CustomerStatus;
  is_blacklisted: boolean;
  transactions_count: number;
  total_spent: number;    // montant en unité de la devise (int)
  metadata: Record<string, unknown>;
}

/** Champs requis à la création */
export interface CreatePayloads {
  email: string;
  name: string;           // éclaté en firstname + lastname côté backend
  phone?: string;
  metadata?: Record<string, unknown>;
}

/** Champs PATCH — tous optionnels */
export interface Payloads {
  email?: string;
  name?: string;
  phone?: string;
  status?: CustomerStatus;
  metadata?: Record<string, unknown>;
}

/** Filtres GET /customers/ — alignés sur get_queryset() */
export interface CustomerCriteria {
  search?: string;        // email, firstname, lastname (icontains)
  status?: CustomerStatus;
  ordering?: string;      // ex: "-created_at", "email"
  page?: number;
  page_size?: number;
}

/** Filtres GET /customers/:id/transactions/ */
export interface TransactionCriteria {
  page?: number;
  page_size?: number;
  ordering?: string;
}