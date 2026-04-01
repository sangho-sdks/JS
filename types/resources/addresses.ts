import type { Timestamps } from "@/types/common";

export type AddressType = "main" | "branch" | "billing" | "shipping";

export interface CompanyAddress extends Timestamps {
  id: string;
  object: "address";
  company: string;
  type: AddressType;
  line1: string;
  line2?: string | null;
  neighborhood?: string | null;
  city: string;
  state?: string | null;
  province?: string | null;
  postal_code: string;
  country: string;       // code ISO retourné par get_country()
  is_active: boolean;
  full_address: string;  // propriété calculée, read-only
}

/** Champs requis à la création — alignés sur CreateAddressSerializer */
export interface CreatePayloads {
  type?: AddressType;    // défaut: "main" (backend)
  line1: string;
  line2?: string;
  neighborhood?: string;
  city: string;
  state?: string;
  province?: string;
  postal_code: string;
  country: string;       // code ISO ex: "GA"
}

/** Champs PATCH — tous optionnels, alignés sur AddressSerializer */
export interface Payloads {
  type?: AddressType;
  line1?: string;
  line2?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  is_active?: boolean;
}

/** Filtres GET /addresses/ — alignés sur get_queryset() */
export interface AddressCriteria {
  type?: AddressType;
  is_active?: boolean;
}