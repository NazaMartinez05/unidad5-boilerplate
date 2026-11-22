import { describe, expect, it } from 'vitest'
import { parseSlotDate, parseSlotTime, summarizeSlots } from './schedule'

describe('parseSlotDate', () => {
  it('keeps the ISO format the backend sends today', () => {
    expect(parseSlotDate('2026-11-24', '14:30')).toBe('2026-11-24')
  })

  it('reads en-US dates (month first) when the time has AM/PM', () => {
    expect(parseSlotDate('11/3/2026', '9:00 AM')).toBe('2026-11-03')
  })

  it('reads es-AR dates (day first) when the time is 24 h', () => {
    expect(parseSlotDate('3/11/2026', '09:00')).toBe('2026-11-03')
  })

  it('uses the part greater than 12 as the day, whatever the hint', () => {
    expect(parseSlotDate('24/11/2026', '9:00 AM')).toBe('2026-11-24')
    expect(parseSlotDate('11/24/2026', '09:00')).toBe('2026-11-24')
  })

  it('returns null for an unknown format', () => {
    expect(parseSlotDate('mañana', '09:00')).toBeNull()
  })
})

describe('parseSlotTime', () => {
  it.each([
    ['14:30', '14:30'],
    ['14:30:00', '14:30'],
    ['2:30 PM', '14:30'],
    ['12:00 PM', '12:00'],
    ['12:30 AM', '00:30'],
  ])('%s -> %s', (input, expected) => {
    expect(parseSlotTime(input)).toBe(expected)
  })
})

describe('summarizeSlots', () => {
  it('groups free slots by weekday with the first start and the last end', () => {
    const summary = summarizeSlots([
      { day: '2026-11-23', startTime: '08:00', endTime: '08:30' },
      { day: '2026-11-23', startTime: '15:30', endTime: '16:00' },
      { day: '2026-11-30', startTime: '08:00', endTime: '08:30' },
      { day: '2026-11-24', startTime: '09:00', endTime: '09:30' },
    ])
    expect(summary).toEqual({
      LUNES: { startTime: '08:00', endTime: '16:00', slots: 3 },
      MARTES: { startTime: '09:00', endTime: '09:30', slots: 1 },
    })
  })

  it('skips slots it cannot read instead of failing', () => {
    expect(summarizeSlots([{ day: '???', startTime: 'x', endTime: 'y' }])).toEqual({})
    expect(summarizeSlots(null)).toEqual({})
  })
})
