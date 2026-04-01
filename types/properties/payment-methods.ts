import type { ListResponse, DRFOptions } from "@/types/common";
import type {
  PaymentMethod,
  AttachPayloads,
  PaymentMethodCriteria,
} from "@/types/resources/payment-methods";

export type PaymentMethodsProperties = {
  list(criteria?: PaymentMethodCriteria): Promise<ListResponse<PaymentMethod>>;
  retrieve(id: string): Promise<PaymentMethod>;
  /**
   * Attache un mode de paiement à un client.
   * @param id      - Identifiant du mode de paiement (`meth_xxx`)
   * @param payloads - `customer` requis
   */
  attach(id: string, payloads: AttachPayloads): Promise<PaymentMethod>;
  /** Détache un mode de paiement de son client. */
  detach(id: string): Promise<PaymentMethod>;
  /** Définit un mode de paiement comme défaut pour son client. */
  setDefault(id: string): Promise<PaymentMethod>;
  options(): Promise<DRFOptions>;
};