import type { ListResponse, DRFOptions } from "@/types/common";
import type {
  Transaction,
  Payloads,
  TransactionCriteria,
} from "@/types/resources/transactions";

export type TransactionsProperties = {
  /**
   * Liste les transactions avec filtres optionnels.
   * Les transactions sont créées automatiquement par les PaymentIntents —
   * elles ne peuvent pas être créées via l'API.
   *
   * @param criteria - Filtres (status, type, montants, dates, pagination)
   */
  list(criteria?: TransactionCriteria): Promise<ListResponse<Transaction>>;

  /**
   * Récupère une transaction par son identifiant.
   * Ajouter `?expand=payment_intent` pour l'objet complet.
   *
   * @param id - Identifiant de la transaction (format `trans_xxx`)
   */
  retrieve(id: string): Promise<Transaction>;

  /**
   * Met à jour la description ou les métadonnées d'une transaction (PATCH).
   * Seuls `description` et `metadata` sont modifiables.
   * Impossible sur les transactions dans un état final.
   *
   * @param id      - Identifiant de la transaction
   * @param payloads - `description` et/ou `metadata`
   */
  update(id: string, payloads: Payloads): Promise<Transaction>;

  /**
   * Annule une transaction en statut `pending` ou `processing`.
   * Impossible sur les transactions `completed`, `failed`, ou `cancelled`.
   *
   * @param id - Identifiant de la transaction (format `trans_xxx`)
   */
  cancel(id: string): Promise<Transaction>;

  /** Retourne les métadonnées DRF du endpoint `/transactions/`. */
  options(): Promise<DRFOptions>;
};