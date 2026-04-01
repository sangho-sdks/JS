// =============================================================================
// sangho-sdk-js — SanghoClient
// =============================================================================
import { HttpClient } from "@/core/http";
import {
  AppsModule,
  AddressesModule,
  CustomersModule,
  ProductsModule,
  PaymentIntentsModule,
  TransactionsModule,
  RefundsModule,
  InvoicesModule,
  PaymentLinksModule,
  CheckoutSessionsModule,
  SubscriptionsModule,
  PaymentMethodsModule,
  ReceiptsModule,
  WebhooksModule,
  SecurityModule,
  PartnersModule,
  TerminalModule,
} from "@/modules";
import { constructEvent } from "@/utils/webhook";
import { SanghoError } from "@/core/errors";
import { InterfaceOnly, SanghoOptions } from "@/types/common";
import {
  AppsProperties,
  AddressesProperties,
  PaymentIntentsProperties,
  CustomersProperties,
  ProductsProperties,
  TransactionsProperties,
  RefundsProperties,
  InvoicesProperties,
  PaymentLinksProperties,
  CheckoutSessionsProperties,
  SubscriptionsProperties,
  PaymentMethodsProperties,
  ReceiptsProperties,
  WebhooksProperties,
  SecurityProperties,
  PartnersProperties,
  TerminalProperties,
} from "@/types/properties";
import { BaseModule } from "./modules/base";
import { Mixins } from "./utils/mixins";

const VALID_KEY_PREFIXES = ["pk_prod_", "sk_prod_", "pk_test_", "sk_test_"] as const;

function validateApiKey(key: string): void {
  if (!key || typeof key !== "string") {
    throw new SanghoError(
      "API key must be a non-empty string. " +
      "Find your API keys at https://dashboard.sangho.com/project/api-keys.",
      "authentication_error"
    );
  }
  if (!VALID_KEY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
    throw new SanghoError(
      `Invalid API key format: "${key.slice(0, 10)}...". ` +
      `Keys must start with pk_prod_, sk_prod_, pk_test_, or sk_test_.`,
      "authentication_error"
    );
  }
  if (key.length < 20) {
    throw new SanghoError("API key is too short.", "authentication_error");
  }
}
/**
 * Client principal du SDK Sangho.
 *
 * @example
 * ```typescript
 * // Côté serveur — clé secrète
 * const sangho = new Sangho("sk_prod_xxx")
 * const intent = await sangho.paymentIntents.create({ amount: 5000, currency: "XAF" })
 *
 * // Côté navigateur — clé publique (checkout uniquement)
 * const sangho = new Sangho("pk_prod_xxx")
 * const session = await sangho.checkoutSessions.retrieve("cs_xxx")
 * ```
 */
export class Sangho extends Mixins(
    BaseModule, AppsModule, AddressesModule, CustomersModule,
    ProductsModule, PaymentIntentsModule, TransactionsModule,
    RefundsModule, InvoicesModule, PaymentLinksModule,
    CheckoutSessionsModule, SubscriptionsModule, PaymentMethodsModule,
    ReceiptsModule, WebhooksModule, SecurityModule, PartnersModule,
    TerminalModule
) {
  declare public readonly apps: InterfaceOnly<AppsProperties>;
  declare public readonly addresses: InterfaceOnly<AddressesProperties>;
  declare public readonly customers: InterfaceOnly<CustomersProperties>;
  declare public readonly products: InterfaceOnly<ProductsProperties>;
  declare public readonly paymentIntents: InterfaceOnly<PaymentIntentsProperties>;
  declare public readonly transactions: InterfaceOnly<TransactionsProperties>;
  declare public readonly refunds: InterfaceOnly<RefundsProperties>;
  declare public readonly invoices: InterfaceOnly<InvoicesProperties>;
  declare public readonly paymentLinks: InterfaceOnly<PaymentLinksProperties>;
  declare public readonly checkoutSessions: InterfaceOnly<CheckoutSessionsProperties>;
  declare public readonly subscriptions: InterfaceOnly<SubscriptionsProperties>;
  declare public readonly paymentMethods: InterfaceOnly<PaymentMethodsProperties>;
  declare public readonly receipts: InterfaceOnly<ReceiptsProperties>;
  declare public readonly webhooks: InterfaceOnly<WebhooksProperties>;
  declare public readonly security: InterfaceOnly<SecurityProperties>;
  declare public readonly partners: InterfaceOnly<PartnersProperties>;
  declare public readonly terminal: InterfaceOnly<TerminalProperties>;

  constructor(apiKey: string, options: SanghoOptions = {}) {
    validateApiKey(apiKey);

    const isSandbox = apiKey.startsWith("pk_test_") || apiKey.startsWith("sk_test_");

    const http = new HttpClient({
      apiKey,
      baseURL: options.baseURL ?? "https://api.sangho.com/v1",
      timeout: options.timeout ?? 30_000,
      maxRetries: options.maxRetries ?? 3,
      sandbox: isSandbox,
    });
    super(http);
  }
  /**
   * Vérifie et parse un événement webhook entrant.
   * Valide la signature HMAC-SHA256 + protection anti-replay (5 min).
   *
   * @param payload   - Corps brut de la requête (Buffer ou string)
   * @param signature - Header `Sangho-Signature` de la requête
   * @param secret    - Secret du webhook (depuis le dashboard)
   *
   * @example
   * ```typescript
   * // Express
   * app.post('/webhooks/sangho', express.raw({ type: 'application/json' }), (req, res) => {
   *   const event = Sangho.constructEvent(
   *     req.body,
   *     req.headers['sangho-signature'],
   *     process.env.SANGHO_WEBHOOK_SECRET
   *   )
   *   if (event.type === 'payment_intent.succeeded') {
   *     await fulfillOrder(event.data)
   *   }
   *   res.json({ received: true })
   * })
   * ```
   */
  static constructEvent = constructEvent;
}

export default Sangho;