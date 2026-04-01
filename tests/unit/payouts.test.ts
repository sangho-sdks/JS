/**
 * tests/unit/payouts.test.ts
 * Tests unitaires du module Payouts
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mockFetchSuccess, mockFetchError } from '../setup'

// TODO: remplace par tes vrais imports
// import { PayoutsModule } from '../../modules/payouts'

// ─── Fixtures ────────────────────────────────────────────────────────────────
const MOCK_PAYOUT = {
  id: 'po_01J8X2K3M4N5P6Q7R8S9T0U1V2',
  object: 'payout',
  amount: 5000,
  currency: 'XAF',
  status: 'pending',
  recipient: {
    phone: '+24177000000',
    operator: 'airtel_money',
    name: 'Jean Dupont',
  },
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
  metadata: {},
}

const MOCK_PAYOUT_LIST = {
  object: 'list',
  data: [MOCK_PAYOUT],
  has_more: false,
  total_count: 1,
}

// ─── Mock minimal du module (à remplacer par le vrai) ────────────────────────
class PayoutsModule {
  constructor(private client: { request: Function }) {}

  async create(params: {
    amount: number
    currency: string
    recipient: { phone: string; operator: string; name?: string }
    metadata?: Record<string, string>
  }) {
    if (!params.amount || params.amount <= 0) {
      throw new Error('amount must be a positive number')
    }
    if (!['XAF', 'XOF'].includes(params.currency)) {
      throw new Error(`Unsupported currency: ${params.currency}`)
    }
    if (!params.recipient.phone) {
      throw new Error('recipient.phone is required')
    }
    return this.client.request('POST', '/v1/payouts', params)
  }

  async retrieve(id: string) {
    if (!id) throw new Error('payout id is required')
    return this.client.request('GET', `/v1/payouts/${id}`)
  }

  async list(params?: {
    limit?: number
    starting_after?: string
    status?: 'pending' | 'paid' | 'failed'
  }) {
    const query = new URLSearchParams(params as any).toString()
    return this.client.request('GET', `/v1/payouts${query ? `?${query}` : ''}`)
  }

  async cancel(id: string) {
    if (!id) throw new Error('payout id is required')
    return this.client.request('DELETE', `/v1/payouts/${id}`)
  }
}

// Faux client pour les tests
const makeFakeClient = () => ({
  request: async (method: string, path: string, body?: unknown) => {
    const response = await fetch(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    })
    return response.json()
  },
})
// ─────────────────────────────────────────────────────────────────────────────

describe('PayoutsModule — create()', () => {
  let payouts: PayoutsModule

  beforeEach(() => {
    payouts = new PayoutsModule(makeFakeClient())
  })

  it('crée un payout avec les paramètres valides', async () => {
    mockFetchSuccess(MOCK_PAYOUT, 201)

    const result = await payouts.create({
      amount: 5000,
      currency: 'XAF',
      recipient: { phone: '+24177000000', operator: 'airtel_money' },
    })

    expect(result).toMatchObject({
      id: expect.stringMatching(/^po_/),
      amount: 5000,
      currency: 'XAF',
      status: 'pending',
    })
  })

  it('refuse un montant négatif', async () => {
    await expect(
      payouts.create({
        amount: -100,
        currency: 'XAF',
        recipient: { phone: '+24177000000', operator: 'airtel_money' },
      })
    ).rejects.toThrow('amount must be a positive number')
  })

  it('refuse un montant nul', async () => {
    await expect(
      payouts.create({
        amount: 0,
        currency: 'XAF',
        recipient: { phone: '+24177000000', operator: 'airtel_money' },
      })
    ).rejects.toThrow('amount must be a positive number')
  })

  it('refuse une devise non supportée', async () => {
    await expect(
      payouts.create({
        amount: 5000,
        currency: 'EUR',
        recipient: { phone: '+24177000000', operator: 'airtel_money' },
      })
    ).rejects.toThrow('Unsupported currency: EUR')
  })

  it('accepte XOF comme devise valide', async () => {
    mockFetchSuccess({ ...MOCK_PAYOUT, currency: 'XOF' }, 201)

    const result = await payouts.create({
      amount: 5000,
      currency: 'XOF',
      recipient: { phone: '+22500000000', operator: 'orange_money' },
    })

    expect(result.currency).toBe('XOF')
  })

  it('refuse un recipient sans numéro de téléphone', async () => {
    await expect(
      payouts.create({
        amount: 5000,
        currency: 'XAF',
        recipient: { phone: '', operator: 'airtel_money' },
      })
    ).rejects.toThrow('recipient.phone is required')
  })

  it('gère une erreur 422 (validation API)', async () => {
    mockFetchSuccess({
      error: { code: 'VALIDATION_ERROR', message: 'Phone number invalid' }
    }, 422)

    // Le module retourne la réponse brute ici — à adapter selon ta gestion d'erreurs
    const result = await payouts.create({
      amount: 5000,
      currency: 'XAF',
      recipient: { phone: '+24100000000', operator: 'airtel_money' },
    })

    expect(result).toHaveProperty('error.code', 'VALIDATION_ERROR')
  })
})

describe('PayoutsModule — retrieve()', () => {
  let payouts: PayoutsModule

  beforeEach(() => {
    payouts = new PayoutsModule(makeFakeClient())
  })

  it('récupère un payout par ID', async () => {
    mockFetchSuccess(MOCK_PAYOUT)

    const result = await payouts.retrieve('po_01J8X2K3M4N5P6Q7R8S9T0U1V2')

    expect(result).toMatchObject({ id: 'po_01J8X2K3M4N5P6Q7R8S9T0U1V2' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/payouts/po_01J8X2K3M4N5P6Q7R8S9T0U1V2'),
      expect.any(Object)
    )
  })

  it('lève une erreur si ID manquant', async () => {
    await expect(payouts.retrieve('')).rejects.toThrow('payout id is required')
  })

  it('gère une erreur 404', async () => {
    mockFetchError(404, { code: 'NOT_FOUND', message: 'Payout not found' })

    // fetch ne throw pas sur 404 — vérifie selon ta gestion d'erreurs
    const result = await payouts.retrieve('po_inexistant')
    expect(result).toHaveProperty('error')
  })
})

describe('PayoutsModule — list()', () => {
  let payouts: PayoutsModule

  beforeEach(() => {
    payouts = new PayoutsModule(makeFakeClient())
  })

  it('liste les payouts sans filtres', async () => {
    mockFetchSuccess(MOCK_PAYOUT_LIST)

    const result = await payouts.list()

    expect(result).toMatchObject({
      object: 'list',
      data: expect.arrayContaining([
        expect.objectContaining({ id: expect.stringMatching(/^po_/) }),
      ]),
    })
  })

  it('liste les payouts avec filtre status', async () => {
    mockFetchSuccess(MOCK_PAYOUT_LIST)

    await payouts.list({ status: 'pending', limit: 10 })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('status=pending'),
      expect.any(Object)
    )
  })
})

describe('PayoutsModule — cancel()', () => {
  let payouts: PayoutsModule

  beforeEach(() => {
    payouts = new PayoutsModule(makeFakeClient())
  })

  it('annule un payout existant', async () => {
    mockFetchSuccess({ ...MOCK_PAYOUT, status: 'cancelled' })

    const result = await payouts.cancel('po_01J8X2K3M4N5P6Q7R8S9T0U1V2')

    expect(result.status).toBe('cancelled')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v1/payouts/po_01J8X2K3M4N5P6Q7R8S9T0U1V2'),
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('lève une erreur si ID manquant', async () => {
    await expect(payouts.cancel('')).rejects.toThrow('payout id is required')
  })
})
