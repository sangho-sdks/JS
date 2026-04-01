import type { SecurityProfile, UpdateSecurityProfileParams } from "@/types/resources/security";

export type SecurityProperties = {
  /**
   * Récupère le profil de sécurité de l'application.
   *
   * @example
   * ```typescript
   * const profile = await sangho.security.retrieve()
   * console.log(profile.allowed_ips)
   * ```
   */
  retrieve(): Promise<SecurityProfile>;

  /** Met à jour les paramètres de sécurité. */
  update(params: UpdateSecurityProfileParams): Promise<SecurityProfile>;

  /**
   * Ajoute des adresses IP à la liste blanche.
   *
   * @param ips - Liste d'IPs au format CIDR (ex: `["192.168.1.0/24"]`)
   */
  addAllowedIps(ips: string[]): Promise<SecurityProfile>;

  /** Retire des adresses IP de la liste blanche. */
  removeAllowedIps(ips: string[]): Promise<SecurityProfile>;
}
