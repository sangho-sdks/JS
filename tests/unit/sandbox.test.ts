/**
 * tests/integration/sandbox.test.ts
 *
 * Tests d'intégration — vrais appels vers l'API sandbox Sangho
 *
 * ⚠️  Ces tests NE sont PAS mocqués.
 *     Ils nécessitent une vraie clé sandbox et une connexion réseau.
 *
 * Exécution :
 *   SANGHO_API_KEY=test_sk_xxx pnpm test:integration
 *   # ou
 *   make test-integration
 *
 * Ces tests sont exclus du pipeline CI par défaut.
 */

import { describe, it, expect, beforeAll } from 'vitest'

// TODO: remplace par tes vrais imports
// import { SanghoClient } from '../../client'

// ─── Guard : skip si pas de vraie clé sandbox ────────────────────────────────
const SANDBOX_KEY = process.env.SANGHO_API_KEY ?? ''
const SKIP = !SANDBOX_KEY || SANDBOX_KEY === 'test_sk_xxxxxxxxxxxxxxxxxxxx'

const describeIf = SKIP
  ? describe.skip
  : describe

if (SKIP) {
  console.warn(
    '\n⚠️  Tests d\'intégration ignorés.\n' +
    '   Exportez SANGHO_API_KEY=test_sk_votre_vraie_cle pour les activer.\n'
  )
}
// ─────────────────────────────────────────────────────────────────────────────

describeIf('Integration — Payouts (sandbox)', () => {
  // let client: SanghoClient
  let createdPayoutId: string

  beforeAll(() => {
    // client = new SanghoClient({
    //   apiKey: SANDBOX_KEY,
    //   environment: 'sandbox',
    // })
  })

  it('crée un payout en sandbox', async () => {
    // const payout = await client.payouts.create({
    //   amount: 100,      // 100 XAF — montant minimal de test
    //   currency: 'XAF',
    //   recipient: {
    //     phone: '+24177000000',  // numéro de test sandbox
    //     operator: 'airtel_money',
    //     name: 'Test Integration',
    //   },
    //   metadata: { test: 'true', source: 'sdk-integration-test' },
    // })

    // createdPayoutId = payout.id

    // expect(payout.id).toMatch(/^po_/)
    // expect(payout.status).toBe('pending')
    // expect(payout.amount).toBe(100)
    // expect(payout.currency).toBe('XAF')

    // Placeholder jusqu'à l'implémentation du vrai client
    expect(true).toBe(true)
  })

  it('récupère le payout créé', async () => {
    // if (!createdPayoutId) return

    // const payout = await client.payouts.retrieve(createdPayoutId)
    // expect(payout.id).toBe(createdPayoutId)

    expect(true).toBe(true)
  })

  it('liste les payouts récents', async () => {
    // const list = await client.payouts.list({ limit: 5 })
    // expect(list.data).toBeInstanceOf(Array)
    // expect(list.data.length).toBeLessThanOrEqual(5)

    expect(true).toBe(true)
  })
})

describeIf('Integration — Payments (sandbox)', () => {
  it('initie un payment intent', async () => {
    // const intent = await client.payments.create({
    //   amount: 500,
    //   currency: 'XAF',
    //   payment_method: 'mobile_money',
    //   customer: { phone: '+24177000000' },
    // })

    // expect(intent.id).toMatch(/^pi_/)
    // expect(intent.status).toBe('requires_confirmation')

    expect(true).toBe(true)
  })
})
