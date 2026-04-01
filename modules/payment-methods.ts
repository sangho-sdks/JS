import { HttpClient } from "@/core/http";
import { BaseModule } from "./base";
import type { ListResponse, DRFOptions } from "@/types/common";
import type {
  PaymentMethod,
  AttachPayloads,
  PaymentMethodCriteria,
} from "@/types/resources/payment-methods";

export class PaymentMethodsModule extends BaseModule {
  public paymentMethods = {
    list: (criteria?: PaymentMethodCriteria) => this._list(criteria),
    retrieve: (id: string) => this._retrieve(id),
    attach: (id: string, payloads: AttachPayloads) => this._attach(id, payloads),
    detach: (id: string) => this._detach(id),
    setDefault: (id: string) => this._setDefault(id),
    options: () => this._options(),
  };

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected _list(criteria?: PaymentMethodCriteria): Promise<ListResponse<PaymentMethod>> {
    this.http.assertSecretKey("paymentMethods.list");
    return this.http.get<ListResponse<PaymentMethod>>("/payment-methods/", criteria);
  }

  protected _retrieve(id: string): Promise<PaymentMethod> {
    this.http.assertSecretKey("paymentMethods.retrieve");
    return this.http.get<PaymentMethod>(`/payment-methods/${id}/`);
  }

  protected _attach(id: string, payloads: AttachPayloads): Promise<PaymentMethod> {
    this.http.assertSecretKey("paymentMethods.attach");
    return this.http.post<PaymentMethod>(`/payment-methods/${id}/attach/`, payloads);
  }

  protected _detach(id: string): Promise<PaymentMethod> {
    this.http.assertSecretKey("paymentMethods.detach");
    return this.http.post<PaymentMethod>(`/payment-methods/${id}/detach/`, {});
  }

  protected _setDefault(id: string): Promise<PaymentMethod> {
    this.http.assertSecretKey("paymentMethods.setDefault");
    return this.http.post<PaymentMethod>(`/payment-methods/${id}/set-default/`, {});
  }

  protected _options(): Promise<DRFOptions> {
    return this.http.options<DRFOptions>("/payment-methods/");
  }
}