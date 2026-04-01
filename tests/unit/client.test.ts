/**
 * tests/unit/client.test.ts
 * Tests unitaires du client HTTP principal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  mockFetchSuccess,
  mockFetchError,
  mockFetchNetworkFailure,
  expectFetchCalledWith,
} from '../setup'

// TODO: ajuste l'import selon ton client réel
// import { SanghoClient } from '../../client'

// ─── Mock du client pour l'exemple ───────────────────────────────────────────
// Remplace par ton vrai client dès qu'il existe
class SanghoClient {
  private apiKey: string
  private baseUrl: string
  private timeout: number

  constructor(options: {
    apiKey: string
    baseUrl?: string
    timeout?: number
    environment?: 'sandbox' | 'production'
  }) {
    if (!options.apiKey) throw new Error('apiKey is required')
    if (!options.apiKey.startsWith('sk_') && !options.apiKey.startsWith('test_sk_')) {
      throw new Error('Invalid apiKey format')
    }
    this.apiKey  = options.apiKey
    this.baseUrl = options.baseUrl ?? 'https://api.sangho.com'
    this.timeout = options.timeout ?? 30_000
  }

  getApiKey()  { return this.apiKey }
  getBaseUrl() { return this.baseUrl }
  getTimeout() { return this.timeout }

  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-SDK-Version': '0.1.0',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message ?? `HTTP ${response.status}`)
    }

    return response.json()
  }
}
// ─────────────────────────────────────────────────────────────────────────────

describe('SanghoClient — instanciation', () => {
  it('crée un client avec les options par défaut', () => {
    const client = new SanghoClient({ apiKey: 'test_sk_valid' })

    expect(client.getApiKey()).toBe('test_sk_valid')
    expect(client.getBaseUrl()).toBe('https://api.sangho.com')
    expect(client.getTimeout()).toBe(30_000)
  })

  it('accepte une baseUrl personnalisée', () => {
    const client = new SanghoClient({
      apiKey: 'test_sk_valid',
      baseUrl: 'https://sandbox.api.sangho.com',
    })

    expect(client.getBaseUrl()).toBe('https://sandbox.api.sangho.com')
  })

  it('lève une erreur si apiKey est manquante', () => {
    expect(() => new SanghoClient({ apiKey: '' })).toThrowError('apiKey is required')
  })

  it('lève une erreur si le format apiKey est invalide', () => {
    expect(
      () => new SanghoClient({ apiKey: 'invalid_key' })
    ).toThrowError('Invalid apiKey format')
  })

  it('accepte un timeout personnalisé', () => {
    const client = new SanghoClient({ apiKey: 'test_sk_valid', timeout: 5_000 })
    expect(client.getTimeout()).toBe(5_000)
  })
})

describe('SanghoClient — requêtes HTTP', () => {
  let client: SanghoClient

  beforeEach(() => {
    client = new SanghoClient({
      apiKey: 'test_sk_xxxxxxxxxxxxxxxxxxxx',
      baseUrl: 'https://sandbox.api.sangho.com',
    })
  })

  it('envoie les bons headers d\'authentification', async () => {
    mockFetchSuccess({ id: 'pay_123', status: 'success' })

    await client.request('GET', '/v1/payments/pay_123')

    expectFetchCalledWith('/v1/payments/pay_123', {
      headers: expect.objectContaining({
        Authorization: 'Bearer test_sk_xxxxxxxxxxxxxxxxxxxx',
        'Content-Type': 'application/json',
      }),
    })
  })

  it('fait une requête GET sans body', async () => {
    mockFetchSuccess({ id: 'pay_123' })

    await client.request('GET', '/v1/payments/pay_123')

    expect(global.fetch).toHaveBeenCalledWith(
      'https://sandbox.api.sangho.com/v1/payments/pay_123',
      expect.objectContaining({ method: 'GET', body: undefined })
    )
  })

  it('sérialise le body en JSON pour POST', async () => {
    mockFetchSuccess({ id: 'pay_456', status: 'pending' })

    await client.request('POST', '/v1/payments', {
      amount: 5000,
      currency: 'XAF',
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ amount: 5000, currency: 'XAF' }),
      })
    )
  })

  it('lève une erreur sur réponse 401', async () => {
    mockFetchError(401, { code: 'UNAUTHORIZED', message: 'Invalid API key' })

    await expect(
      client.request('GET', '/v1/payments')
    ).rejects.toThrow('Invalid API key')
  })

  it('lève une erreur sur réponse 404', async () => {
    mockFetchError(404, { code: 'NOT_FOUND', message: 'Payment not found' })

    await expect(
      client.request('GET', '/v1/payments/inexistant')
    ).rejects.toThrow('Payment not found')
  })

  it('lève une erreur sur réponse 500', async () => {
    mockFetchError(500, { code: 'SERVER_ERROR', message: 'Internal server error' })

    await expect(
      client.request('POST', '/v1/payments', {})
    ).rejects.toThrow('Internal server error')
  })

  it('lève une erreur réseau (pas de connexion)', async () => {
    mockFetchNetworkFailure('Failed to fetch')

    await expect(
      client.request('GET', '/v1/payments')
    ).rejects.toThrow('Failed to fetch')
  })
})
