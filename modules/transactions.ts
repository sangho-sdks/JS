import { HttpClient } from "@/core/http";
import { BaseModule } from "./base";
import type { ListResponse, DRFOptions } from "@/types/common";
import type {
  Transaction,
  Payloads,
  TransactionCriteria,
} from "@/types/resources/transactions";

export class TransactionsModule extends BaseModule {
  public transactions = {
    list: (criteria?: TransactionCriteria) => this._list(criteria),
    retrieve: (id: string) => this._retrieve(id),
    update: (id: string, payloads: Payloads) => this._update(id, payloads),
    cancel: (id: string) => this._cancel(id),
    options: () => this._options(),
  };

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected _list(criteria?: TransactionCriteria): Promise<ListResponse<Transaction>> {
    this.http.assertSecretKey("transactions.list");
    return this.http.get<ListResponse<Transaction>>("/transactions/", criteria);
  }

  protected _retrieve(id: string): Promise<Transaction> {
    this.http.assertSecretKey("transactions.retrieve");
    return this.http.get<Transaction>(`/transactions/${id}/`);
  }

  protected _update(id: string, payloads: Payloads): Promise<Transaction> {
    this.http.assertSecretKey("transactions.update");
    return this.http.patch<Transaction>(`/transactions/${id}/`, payloads);
  }

  protected _cancel(id: string): Promise<Transaction> {
    this.http.assertSecretKey("transactions.cancel");
    return this.http.post<Transaction>(`/transactions/${id}/cancel/`, {});
  }

  protected _options(): Promise<DRFOptions> {
    return this.http.options<DRFOptions>("/transactions/");
  }
}