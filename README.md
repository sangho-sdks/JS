# @sangho/sdk — SDK JavaScript / TypeScript officiel

SDK officiel de [Sangho](https://sangho.com), la plateforme de paiement B2B pour l'Afrique francophone.

[![npm](https://img.shields.io/npm/v/@sangho/sdk)](https://www.npmjs.com/package/@sangho/sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Docs](https://img.shields.io/badge/docs-docs.sangho.com-navy)](https://docs.sangho.com)

---

## Installation

```bash
npm install @sangho/sdk
# ou
pnpm add @sangho/sdk
# ou
yarn add @sangho/sdk
```

Via CDN (navigateur uniquement, clé publique) :

```html
<script src="https://js.sangho.com/v1/sangho.min.js"></script>
```

---

## Clés API

| Préfixe       | Environnement | Usage                          |
|---------------|---------------|--------------------------------|
| `sk_prod_`    | Production    | Serveur uniquement             |
| `sk_test_`    | Sandbox       | Serveur uniquement (tests)     |
| `pk_prod_`    | Production    | Navigateur (checkout public)   |
| `pk_test_`    | Sandbox       | Navigateur (checkout tests)    |

> ⚠️ **Ne jamais exposer `sk_prod_` ou `sk_test_` dans du code client (navigateur, app mobile).**

---

## Démarrage rapide

```typescript
import { Sangho } from "@sangho/sdk"

// Initialisation (côté serveur — clé secrète)
const sangho = new Sangho("sk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxx")

// Créer un client
const customer = await sangho.customers.create({
  email: "jean.ondo@example.ga",
  name: "Jean Ondo",
  phone: "+24107000001",
  currency: "XAF",
})

// Créer un PaymentIntent
const intent = await sangho.paymentIntents.create({
  amount: 50_000,    // 500.00 XAF (en centimes)
  currency: "XAF",
  customer: customer.id,
  description: "Commande #1234",
})

// Confirmer le paiement
const confirmed = await sangho.paymentIntents.confirm(intent.id, {
  payment_method: "pm_xxx",
  return_url: "https://monsite.com/return",
})

console.log(confirmed.status) // "succeeded" | "requires_action" | ...
```

---

## Modules disponibles

### Customers

```typescript
// Créer
const customer = await sangho.customers.create({ email, name, phone, currency })

// Récupérer
const customer = await sangho.customers.retrieve("cus_xxx")

// Mettre à jour
const customer = await sangho.customers.update("cus_xxx", { phone: "+24107000002" })

// Supprimer
await sangho.customers.delete("cus_xxx")

// Lister (avec filtres)
const { results, count } = await sangho.customers.list({
  page: 1,
  page_size: 20,
  status: "active",
  currency: "XAF",
})

// Transactions d'un client
const txns = await sangho.customers.listTransactions("cus_xxx")

// Modes de paiement d'un client
const methods = await sangho.customers.listPaymentMethods("cus_xxx")
```

### Products

```typescript
const product = await sangho.products.create({
  name: "Abonnement Premium",
  type: "subscription",
  unit_amount: 15_000,
  currency: "XAF",
})

await sangho.products.addImage(product.id, {
  url: "https://cdn.sangho.com/img/premium.png",
  is_primary: true,
})

await sangho.products.archive("prod_xxx")
```

### Payment Intents

```typescript
// Créer et confirmer en une étape
const intent = await sangho.paymentIntents.create({
  amount: 10_000,
  currency: "XAF",
  customer: "cus_xxx",
  confirm: true,
  payment_method: "pm_xxx",
})

// Capture manuelle
await sangho.paymentIntents.capture("pi_xxx", { amount_to_capture: 8_000 })

// Annuler
await sangho.paymentIntents.cancel("pi_xxx", {
  cancellation_reason: "requested_by_customer",
})
```

### Transactions

```typescript
// Lecture seule
const txn = await sangho.transactions.retrieve("txn_xxx")

const { results } = await sangho.transactions.list({
  status: "succeeded",
  currency: "XAF",
  created_after: "2024-01-01T00:00:00Z",
  min_amount: 1_000,
})
```

### Refunds

```typescript
// Remboursement partiel
const refund = await sangho.refunds.create({
  transaction: "txn_xxx",
  amount: 5_000,
  reason: "requested_by_customer",
})

await sangho.refunds.cancel("re_xxx")
```

### Invoices

```typescript
const invoice = await sangho.invoices.create({
  customer: "cus_xxx",
  currency: "XAF",
  line_items: [
    { description: "Consultation", quantity: 2, unit_amount: 25_000 },
    { description: "Frais de déplacement", quantity: 1, unit_amount: 10_000 },
  ],
  tax_rate: 18, // 18% TVA
  due_date: "2024-12-31",
})

await sangho.invoices.send(invoice.id)

// Télécharger le PDF
const { url } = await sangho.invoices.getPdfUrl(invoice.id)
```

### Payment Links

```typescript
const link = await sangho.paymentLinks.create({
  currency: "XAF",
  line_items: [{ product: "prod_xxx", quantity: 1 }],
  success_url: "https://monsite.com/merci",
  usage_limit: 100,
})

console.log(link.url) // https://checkout.sangho.com/pay/pl_xxx
```

### Checkout Sessions

```typescript
const session = await sangho.checkoutSessions.create({
  mode: "payment",
  currency: "XAF",
  line_items: [{ product: "prod_xxx", quantity: 1 }],
  success_url: "https://monsite.com/success",
  cancel_url: "https://monsite.com/cancel",
  expires_in: 3600, // 1 heure
})

// Rediriger le client vers session.url
```

### Subscriptions

```typescript
const sub = await sangho.subscriptions.create({
  customer: "cus_xxx",
  currency: "XAF",
  unit_amount: 15_000,
  interval: "month",
  trial_period_days: 14,
})

await sangho.subscriptions.pause("sub_xxx")
await sangho.subscriptions.resume("sub_xxx")
await sangho.subscriptions.cancel("sub_xxx", { cancel_at_period_end: true })
```

### Webhooks

```typescript
const webhook = await sangho.webhooks.create({
  url: "https://monserveur.com/webhooks/sangho",
  events: [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "customer.created",
    "invoice.paid",
  ],
})

// Régénérer le secret
const { secret } = await sangho.webhooks.rollSecret(webhook.id)

// Voir les livraisons
const deliveries = await sangho.webhooks.listDeliveries(webhook.id, {
  status: "failed",
})

// Rejouer une livraison
await sangho.webhooks.replayDelivery(webhook.id, "wdl_xxx")
```

### Vérification des signatures webhook

```typescript
import { Sangho } from "@sangho/sdk"

// Express
app.post(
  "/webhooks/sangho",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const event = await Sangho.constructEvent(
        req.body,
        req.headers["sangho-signature"] as string,
        process.env.SANGHO_WEBHOOK_SECRET!
      )

      switch (event.type) {
        case "payment_intent.succeeded":
          await handleSuccessfulPayment(event.data)
          break
        case "invoice.paid":
          await markInvoicePaid(event.data)
          break
      }

      res.json({ received: true })
    } catch (err) {
      res.status(400).send(`Webhook error: ${err.message}`)
    }
  }
)
```

---

## Gestion des erreurs

```typescript
import {
  Sangho,
  SanghoAuthError,
  SanghoValidationError,
  SanghoNotFoundError,
  SanghoRateLimitError,
} from "@sangho/sdk"

try {
  const customer = await sangho.customers.create({ email: "invalid" })
} catch (err) {
  if (err instanceof SanghoValidationError) {
    console.error("Erreurs de validation:", err.fieldErrors)
    // { email: ["Enter a valid email address."] }
  } else if (err instanceof SanghoAuthError) {
    console.error("Clé API invalide ou expirée")
  } else if (err instanceof SanghoNotFoundError) {
    console.error("Ressource introuvable")
  } else if (err instanceof SanghoRateLimitError) {
    console.error(`Limite de taux dépassée. Réessayez dans ${err.retryAfter}s`)
  } else {
    throw err
  }
}
```

---

## Options avancées

```typescript
const sangho = new Sangho("sk_test_xxx", {
  timeout: 10_000,      // Timeout en ms (défaut : 30 000)
  maxRetries: 5,        // Nombre de retries auto (défaut : 3)
  baseURL: "https://api.staging.sangho.com/v1",  // URL custom (staging)
})
```

---

## Sécurité

- La clé API est transmise uniquement via le header `Authorization: Bearer`
- Chaque requête POST génère automatiquement une `Idempotency-Key` unique (UUID v4)
- Les retries auto n'ont lieu que pour les erreurs `429` et `5xx` (jamais `4xx`)
- La vérification de signature webhook utilise HMAC-SHA256 avec protection anti-replay (5 min)
- Les clés `sk_` sont rejetées côté SDK si utilisées avec des opérations non autorisées (ex: checkout public)

---

## Compatibilité

| Environnement | Support |
|---|---|
| Node.js ≥ 18 | ✅ natif |
| Navigateur moderne | ✅ ESM + UMD |
| TypeScript ≥ 5.0 | ✅ types complets |
| Deno | ✅ via npm: |
| Bun | ✅ |

---

## Licence

MIT © [Sangho](https://sangho.com)
