import { HttpClient } from "@/core/http";
import { BaseModule } from "./base";
import type { ListResponse, DRFOptions } from "@/types/common";
import type { Receipt, ReceiptCriteria } from "@/types/resources/receipts";

export class ReceiptsModule extends BaseModule {
  public receipts = {
    list: (criteria?: ReceiptCriteria) => this._list(criteria),
    retrieve: (id: string) => this._retrieve(id),
    getPdfUrl: (id: string) => this._getPdfUrl(id),
    options: () => this._options(),
  };

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected _list(criteria?: ReceiptCriteria): Promise<ListResponse<Receipt>> {
    this.http.assertSecretKey("receipts.list");
    return this.http.get<ListResponse<Receipt>>("/receipts/", criteria);
  }

  protected _retrieve(id: string): Promise<Receipt> {
    this.http.assertSecretKey("receipts.retrieve");
    return this.http.get<Receipt>(`/receipts/${id}/`);
  }

  protected _getPdfUrl(id: string): Promise<{ url: string; expires_at: string }> {
    this.http.assertSecretKey("receipts.getPdfUrl");
    return this.http.get<{ url: string; expires_at: string }>(`/receipts/${id}/pdf/`);
  }

  protected _options(): Promise<DRFOptions> {
    return this.http.options<DRFOptions>("/receipts/");
  }
}