import type { ListResponse, DRFOptions } from "@/types/common";
import type { Partner, PartnerCriteria } from "@/types/resources/partners";

export type PartnersProperties = {
  /**
   * Liste les partenaires actifs de la plateforme.
   * Lecture seule — les partenaires ne peuvent pas être créés via l'API.
   */
  list(criteria?: PartnerCriteria): Promise<ListResponse<Partner>>;

  /**
   * Récupère un partenaire par son identifiant.
   * @param id - Identifiant du partenaire
   */
  retrieve(id: string): Promise<Partner>;

  options(): Promise<DRFOptions>;
};