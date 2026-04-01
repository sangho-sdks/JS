import { BaseModule } from "./base";
import type { SecurityProfile, UpdateSecurityProfileParams } from "@/types/resources/security";

export class SecurityModule extends BaseModule {
  async retrieve(): Promise<SecurityProfile> {
    this.http.assertSecretKey("security.retrieve");
    return this.http.get<SecurityProfile>("/security/");
  }
  async update(params: UpdateSecurityProfileParams): Promise<SecurityProfile> {
    this.http.assertSecretKey("security.update");
    return this.http.patch<SecurityProfile>("/security/", params);
  }
  async addAllowedIps(ips: string[]): Promise<SecurityProfile> {
    this.http.assertSecretKey("security.addAllowedIps");
    return this.http.post<SecurityProfile>("/security/allowed-ips/add/", { ips });
  }
  async removeAllowedIps(ips: string[]): Promise<SecurityProfile> {
    this.http.assertSecretKey("security.removeAllowedIps");
    return this.http.post<SecurityProfile>("/security/allowed-ips/remove/", { ips });
  }
}
