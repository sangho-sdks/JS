// =============================================================================
// sangho-sdk-js — Types communs
// =============================================================================

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface ListParams {
  /** Numéro de page (défaut : 1) */
  page?: number;
  /** Nombre d'éléments par page (défaut : 20, max : 100) */
  page_size?: number;
  /** Tri ex: "-created_at" (préfixe - pour DESC) */
  ordering?: string;
  /** Recherche full-text */
  search?: string;
}

export interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ─── Timestamps ───────────────────────────────────────────────────────────────

export interface Timestamps {
  created_at: string; // ISO 8601
  updated_at: string;
}

// ─── Monnaie ──────────────────────────────────────────────────────────────────

/** Montant monétaire exprimé en centimes (integer). Ex: 5000 = 50.00 XAF */
export type AmountInCents = number;

export type CurrencyCode =
  | "XAF" | "XOF" | "USD" | "EUR" | "GNF" | "CDF" | "MGA" | "STN"
  | "CVE" | "DJF" | "ERN" | "ETB" | "GMD" | "GHS" | "KES" | "LRD"
  | "LSL" | "MWK" | "MZN" | "NAD" | "NGN" | "RWF" | "SCR" | "SLL"
  | "SOS" | "SZL" | "TZS" | "UGX" | "ZAR" | "ZMW" | "ZWL";

// ─── Statuts génériques ───────────────────────────────────────────────────────

export type ActiveStatus = "active" | "inactive";
export type SandboxMode = "live" | "test";

/** Réponse paginée standard */
export interface SanghoList<T> {
  data: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ─── Métadonnées libres ───────────────────────────────────────────────────────

/** Dictionnaire clé/valeur libre, max 50 clés, valeurs string. */
export type Metadata = Record<string, string>;

// ─── Adresse ──────────────────────────────────────────────────────────────────

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string; // code ISO 3166-1 alpha-2
}

// ─── Options SDK ──────────────────────────────────────────────────────────────

export interface SanghoOptions {
  /** Override URL de base (utile pour tests/staging) */
  baseURL?: string;
  /** Timeout en ms (défaut : 30 000) */
  timeout?: number;
  /** Nombre de retries auto (défaut : 3) */
  maxRetries?: number;
}

/**
 * A utility type for creating class property interfaces that don't overwrite 
 * actual implementation values when used as type definitions
 */
export type InterfaceOnly<T> = {
  [P in keyof T]?: T[P];
}


export interface DRFOptions {
  name: string;
  description: string;
  renders: string[];
  parses: string[];
  actions?: Record<string, unknown>;
}

export type ForeignKey = string | number | null;