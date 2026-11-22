import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearSession,
  getSession,
  getTokenExpiry,
  isTokenExpired,
  roleMatches,
  ROLES,
  saveSession,
} from './session'

// Unsigned JWT with the given payload (the front only reads the payload)
const makeToken = (payload) => `header.${btoa(JSON.stringify(payload))}.signature`

describe('roleMatches', () => {
  it('accepts a role in the list, ignoring case', () => {
    expect(roleMatches('Administrador', [ROLES.admin])).toBe(true)
    expect(roleMatches('ADMINISTRADOR', [ROLES.admin])).toBe(true)
  })

  it('rejects another role or no role', () => {
    expect(roleMatches('Paciente', [ROLES.admin])).toBe(false)
    expect(roleMatches(null, [ROLES.admin])).toBe(false)
    expect(roleMatches('', [ROLES.admin, ROLES.patient])).toBe(false)
  })
})

describe('token expiry', () => {
  it('reads the exp claim in milliseconds', () => {
    expect(getTokenExpiry(makeToken({ exp: 1_800_000_000 }))).toBe(1_800_000_000_000)
  })

  it('returns null for a token without a readable exp', () => {
    expect(getTokenExpiry('not-a-jwt')).toBeNull()
    expect(getTokenExpiry(makeToken({ sub: 'x' }))).toBeNull()
  })

  it('is expired only when exp is in the past', () => {
    const now = 1_800_000_000_000
    expect(isTokenExpired(makeToken({ exp: 1_799_999_999 }), now)).toBe(true)
    expect(isTokenExpired(makeToken({ exp: 1_800_000_100 }), now)).toBe(false)
  })

  it('treats an unreadable token as valid (the backend decides)', () => {
    expect(isTokenExpired('not-a-jwt')).toBe(false)
    expect(isTokenExpired(null)).toBe(false)
  })
})

describe('session storage', () => {
  beforeEach(() => localStorage.clear())

  it('saves and clears every key', () => {
    saveSession({ token: 't', role: ROLES.patient, email: 'a@b.com', dni: '43501357' })
    expect(getSession()).toEqual({ token: 't', role: 'Paciente', email: 'a@b.com', dni: '43501357' })

    clearSession()
    expect(getSession()).toEqual({ token: null, role: null, email: null, dni: null })
  })

  it('does not keep the dni of a previous patient when an admin logs in', () => {
    saveSession({ token: 't1', role: ROLES.patient, email: 'p@b.com', dni: '43501357' })
    saveSession({ token: 't2', role: ROLES.admin, email: 'admin@b.com' })
    expect(getSession().dni).toBeNull()
  })
})
