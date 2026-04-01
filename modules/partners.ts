import { HttpClient } from "@/core/http";
import { BaseModule } from "./base";
import type { ListResponse, DRFOptions } from "@/types/common";
import type { Partner, PartnerCriteria } from "@/types/resources/partners";

export class PartnersModule extends BaseModule {
  public partners = {
    list: (criteria?: PartnerCriteria) => this._list(criteria),
    retrieve: (id: string) => this._retrieve(id),
    options: () => this._options(),
  };

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected _list(criteria?: PartnerCriteria): Promise<ListResponse<Partner>> {
    this.http.assertSecretKey("partners.list");
    return this.http.get<ListResponse<Partner>>("/partners/", criteria);
  }

  protected _retrieve(id: string): Promise<Partner> {
    this.http.assertSecretKey("partners.retrieve");
    return this.http.get<Partner>(`/partners/${id}/`);
  }

  protected _options(): Promise<DRFOptions> {
    return this.http.options<DRFOptions>("/partners/");
  }
}