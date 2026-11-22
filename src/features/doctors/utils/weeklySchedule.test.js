import { describe, expect, it } from 'vitest'
import { emptySchedule, scheduleFromSlots, toAvailabilityDays, validateAvailabilityDays } from './weeklySchedule'

describe('validateAvailabilityDays', () => {
  it('requires at least one active day', () => {
    expect(validateAvailabilityDays([])).toBe('Active al menos un día de atención.')
  })

  it('requires the start before the end', () => {
    expect(validateAvailabilityDays([{ day: 'LUNES', startTime: '16:00', endTime: '08:00' }])).toMatch(/lunes/)
  })

  it('only accepts times on the hour or half hour (30-minute slots)', () => {
    expect(validateAvailabilityDays([{ day: 'MARTES', startTime: '08:15', endTime: '12:00' }])).toMatch(/30 minutos/)
  })

  it('accepts a valid schedule', () => {
    expect(validateAvailabilityDays([{ day: 'LUNES', startTime: '08:00', endTime: '12:30' }])).toBe('')
  })
})

describe('weekly schedule <-> backend', () => {
  it('has no Sunday', () => {
    expect(Object.keys(emptySchedule())).not.toContain('DOMINGO')
  })

  it('builds the schedule from the free slots (accent-insensitive days)', () => {
    const schedule = scheduleFromSlots([
      { day: '2026-11-25', startTime: '14:00', endTime: '14:30' },
      { day: '2026-11-25', startTime: '14:30', endTime: '15:00' },
    ])
    expect(schedule['MIÉRCOLES']).toEqual({ enabled: true, startTime: '14:00', endTime: '15:00' })
    expect(schedule.LUNES.enabled).toBe(false)
  })

  it('sends only the active days', () => {
    const schedule = emptySchedule()
    schedule.JUEVES = { enabled: true, startTime: '08:00', endTime: '12:30' }
    expect(toAvailabilityDays(schedule)).toEqual([{ day: 'JUEVES', startTime: '08:00', endTime: '12:30' }])
  })
})
