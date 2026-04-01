import type { ListParams, Timestamps } from "@/types/common";

export type PartnerStatus = "active" | "inactive";
export type PartnerService = "PAYMENT" | "FRAUD" | "KYC" | "SETTLEMENT";

/** Représente un partenaire Sangho. Lecture seule. */
export interface Partner extends Timestamps {
  id: string;
  object: "partner";
  name: string;
  webhook_url: string;
  services: PartnerService[];
  status: PartnerStatus;
  last_used?: string | null;
}

/** Filtres GET /partners/ */
export interface PartnerCriteria extends ListParams {
  status?: PartnerStatus;
}