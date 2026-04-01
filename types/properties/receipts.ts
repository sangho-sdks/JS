import type { ListResponse, DRFOptions } from "@/types/common";
import type { Receipt, ReceiptCriteria } from "@/types/resources/receipts";

export type ReceiptsProperties = {
  /**
   * Liste les reçus de l'app avec filtres optionnels.
   *
   * @param criteria - Filtres (customer, transaction, status, pagination)
   *
   * @example
   * const all  = await sangho.receipts.list()
   * const paid = await sangho.receipts.list({ status: "issued" })
   */
  list(criteria?: ReceiptCriteria): Promise<ListResponse<Receipt>>;

  /**
   * Récupère un reçu par son identifiant.
   *
   * @param id - Identifiant du reçu (format `rec_xxx`)
   */
  retrieve(id: string): Promise<Receipt>;

  /**
   * Retourne l'URL de téléchargement PDF du reçu.
   * L'URL expire après 1 heure.
   *
   * @param id - Identifiant du reçu
   * @returns URL temporaire + date d'expiration ISO 8601
   *
   * @example
   * const { url } = await sangho.receipts.getPdfUrl("rec_xxx")
   * window.open(url)
   */
  getPdfUrl(id: string): Promise<{ url: string; expires_at: string }>;

  /** Retourne les métadonnées DRF du endpoint `/receipts/`. */
  options(): Promise<DRFOptions>;
};