import { describe, expect, it } from 'vitest'
import { findAvailability, getDoctorsOfSpeciality, getFreeTimes, getSpecialitiesFromDoctors } from './booking'

const CARDIO = { specialityId: 'sp1', name: 'Cardiología' }
const doctors = [
  { id: 'd1', name: 'Velarde', isActive: true, speciality: CARDIO },
  { id: 'd2', name: 'Soria', isActive: true, speciality: { specialityId: 'sp2', name: 'Ginecología' } },
  { id: 'd3', name: 'Inactivo', isActive: false, speciality: { specialityId: 'sp3', name: 'Neurología' } },
]

describe('specialities and doctors for the combos', () => {
  it('lists the specialities of active doctors only, sorted', () => {
    expect(getSpecialitiesFromDoctors(doctors)).toEqual([
      { id: 'sp1', name: 'Cardiología' },
      { id: 'sp2', name: 'Ginecología' },
    ])
  })

  it('filters the active doctors of a speciality', () => {
    expect(getDoctorsOfSpeciality(doctors, 'sp1').map((d) => d.id)).toEqual(['d1'])
    expect(getDoctorsOfSpeciality(doctors, 'sp3')).toEqual([])
  })
})

describe('free times of a day', () => {
  const availabilities = [
    { id: 's1', date: '2026-11-24', time: '08:00' },
    { id: 's2', date: '2026-11-24', time: '14:30' },
    { id: 's3', date: '2026-11-25', time: '10:00' },
  ]
  const tuesday = new Date(2026, 10, 24)

  it('returns the times of that day', () => {
    expect(getFreeTimes(availabilities, tuesday, new Date(2026, 10, 20))).toEqual(['08:00', '14:30'])
  })

  it('hides the times already past', () => {
    expect(getFreeTimes(availabilities, tuesday, new Date(2026, 10, 24, 12, 0))).toEqual(['14:30'])
  })

  it('finds the backend slot behind a grid selection', () => {
    expect(findAvailability(availabilities, { date: tuesday, time: '14:30' })?.id).toBe('s2')
    expect(findAvailability(availabilities, null)).toBeNull()
  })
})
