/**
 * tests/unit/utils.test.ts
 * Tests des utilitaires / helpers du SDK
 */

import { describe, it, expect } from 'vitest'

// TODO: remplace par tes vrais imports
// import { formatAmount, validatePhone, buildQueryString, isValidApiKey } from '../../utils'

// ─── Implémentations mock (à remplacer par tes vrais utils) ──────────────────

/** Formate un montant en centimes vers une chaîne lisible */
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Valide un numéro de téléphone africain */
function validatePhone(phone: string): boolean {
  // +241 (Gabon), +237 (Cameroun), +225 (Côte d'Ivoire), +221 (Sénégal)
  return /^\+(?:241|237|225|221|242|243|236|235|234)\d{8,9}$/.test(phone)
}

/** Construit une query string à partir d'un objet */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined)
  if (filtered.length === 0) return ''
  return '?' + new URLSearchParams(
    filtered.map(([k, v]) => [k, String(v)])
  ).toString()
}

/** Valide le format d'une clé API Sangho */
function isValidApiKey(key: string): boolean {
  return /^(sk|pk|test_sk|test_pk)_[a-zA-Z0-9]{20,}$/.test(key)
}

/** Masque une clé API pour les logs */
function maskApiKey(key: string): string {
  if (key.length < 12) return '***'
  return key.slice(0, 8) + '***' + key.slice(-4)
}

/** Convertit un montant XAF en unité de base (pas de décimales) */
function toBaseUnit(amount: number, currency: string): number {
  const zeroDecimalCurrencies = ['XAF', 'XOF', 'GNF', 'MGA']
  return zeroDecimalCurrencies.includes(currency) ? amount : Math.round(amount * 100)
}
// ─────────────────────────────────────────────────────────────────────────────

describe('formatAmount()', () => {
  it('formate un montant XAF sans décimales', () => {
    const result = formatAmount(5000, 'XAF')
    expect(result).toContain('5')
    expect(result).toContain('000')
  })

  it('formate correctement différentes devises', () => {
    expect(formatAmount(1000, 'XAF')).toContain('1')
    expect(formatAmount(1000, 'XOF')).toContain('1')
  })
})

describe('validatePhone()', () => {
  it('valide un numéro gabonais (+241)', () => {
    expect(validatePhone('+24177000000')).toBe(true)
    expect(validatePhone('+24166000000')).toBe(true)
  })

  it('valide un numéro camerounais (+237)', () => {
    expect(validatePhone('+237670000000')).toBe(true)
  })

  it('valide un numéro ivoirien (+225)', () => {
    expect(validatePhone('+2250700000000')).toBe(true)
  })

  it('rejette un numéro sans indicatif pays', () => {
    expect(validatePhone('77000000')).toBe(false)
  })

  it('rejette un indicatif pays non supporté', () => {
    expect(validatePhone('+33612345678')).toBe(false)  // France
    expect(validatePhone('+12125551234')).toBe(false)  // USA
  })

  it('rejette une chaîne vide', () => {
    expect(validatePhone('')).toBe(false)
  })

  it('rejette un numéro avec lettres', () => {
    expect(validatePhone('+241abc0000')).toBe(false)
  })
})

describe('buildQueryString()', () => {
  it('retourne une chaîne vide si pas de params', () => {
    expect(buildQueryString({})).toBe('')
  })

  it('construit une query string simple', () => {
    const qs = buildQueryString({ limit: 10, status: 'pending' })
    expect(qs).toContain('limit=10')
    expect(qs).toContain('status=pending')
    expect(qs.startsWith('?')).toBe(true)
  })

  it('ignore les valeurs undefined', () => {
    const qs = buildQueryString({ limit: 10, status: undefined, cursor: undefined })
    expect(qs).toBe('?limit=10')
  })

  it('encode correctement les caractères spéciaux', () => {
    const qs = buildQueryString({ name: 'Jean Dupont' })
    expect(qs).toContain('Jean+Dupont')
  })

  it('gère les booléens', () => {
    const qs = buildQueryString({ include_cancelled: true })
    expect(qs).toContain('include_cancelled=true')
  })
})

describe('isValidApiKey()', () => {
  it('accepte une clé live sk_', () => {
    expect(isValidApiKey('sk_abcdefghijklmnopqrstu')).toBe(true)
  })

  it('accepte une clé live pk_', () => {
    expect(isValidApiKey('pk_abcdefghijklmnopqrstu')).toBe(true)
  })

  it('accepte une clé sandbox test_sk_', () => {
    expect(isValidApiKey('test_sk_xxxxxxxxxxxxxxxxxxxx')).toBe(true)
  })

  it('accepte une clé sandbox test_pk_', () => {
    expect(isValidApiKey('test_pk_xxxxxxxxxxxxxxxxxxxx')).toBe(true)
  })

  it('rejette une clé trop courte', () => {
    expect(isValidApiKey('sk_short')).toBe(false)
  })

  it('rejette une clé sans préfixe reconnu', () => {
    expect(isValidApiKey('invalid_key_abc123')).toBe(false)
  })

  it('rejette une chaîne vide', () => {
    expect(isValidApiKey('')).toBe(false)
  })
})

describe('maskApiKey()', () => {
  it('masque correctement une clé longue', () => {
    const masked = maskApiKey('test_sk_xxxxxxxxxxxxxxxxxxxx')
    expect(masked).toContain('***')
    expect(masked.startsWith('test_sk_')).toBe(true)
    expect(masked.endsWith('xxxx')).toBe(true)
    // La clé originale ne doit pas être entièrement visible
    expect(masked).not.toBe('test_sk_xxxxxxxxxxxxxxxxxxxx')
  })

  it('retourne *** si clé trop courte', () => {
    expect(maskApiKey('abc')).toBe('***')
  })
})

describe('toBaseUnit()', () => {
  it('retourne le montant tel quel pour XAF (0 décimales)', () => {
    expect(toBaseUnit(5000, 'XAF')).toBe(5000)
  })

  it('retourne le montant tel quel pour XOF', () => {
    expect(toBaseUnit(1000, 'XOF')).toBe(1000)
  })

  it('multiplie par 100 pour les devises à 2 décimales', () => {
    expect(toBaseUnit(10.50, 'USD')).toBe(1050)
    expect(toBaseUnit(9.99, 'EUR')).toBe(999)
  })
})
