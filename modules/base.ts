// =============================================================================
// sangho-sdk-js — BaseModule
// Classe parente de tous les modules du SDK.
// Chaque module reçoit un HttpClient par injection (composition over inheritance).
// =============================================================================

import type { HttpClient } from "@/core/http";

/**
 * Classe de base dont héritent tous les modules Sangho.
 *
 * Pattern : composition via injection de `HttpClient`.
 * Jamais d'héritage multiple — un seul HttpClient partagé par instance Sangho.
 *
 * @example
 * ```typescript
 * export class CustomersModule extends BaseModule {
 *   async create(params: CreateCustomerParams): Promise<Customer> {
 *     this.http.assertSecretKey("customers.create");
 *     return this.http.post<Customer>("/customers/", params);
 *   }
 * }
 * ```
 */
export class BaseModule {
  /** Client HTTP partagé — ne jamais exposer publiquement. */
  protected readonly http: HttpClient;

  public constructor(http: HttpClient) {
    this.http = http;
  }
}
