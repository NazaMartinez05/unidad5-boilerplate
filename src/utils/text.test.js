import { describe, expect, it } from 'vitest'
import { getInitials, getNameFromEmail } from './text'

describe('getInitials', () => {
  it('takes the first letter of the first two words, skipping titles', () => {
    expect(getInitials('Elena Martínez')).toBe('EM')
    expect(getInitials('Dra. María González López')).toBe('MG')
    expect(getInitials('')).toBe('')
  })
})

describe('getNameFromEmail', () => {
  it('builds a display name from the email user', () => {
    expect(getNameFromEmail('johnathan.doe@mail.com')).toBe('Johnathan Doe')
    expect(getNameFromEmail(null)).toBe('Paciente')
  })
})
