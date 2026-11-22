import { isPastSlot, toIsoDate } from '../../../utils/dates'

// Unique specialities of the active doctors, sorted by name. GET /api/specialties/allSpeciality
// is admin-only (403 for a patient), and the doctors list already has them.
export function getSpecialitiesFromDoctors(doctors) {
  const map = new Map()
  doctors.forEach((d) => {
    if (d.isActive && d.speciality?.specialityId) map.set(d.speciality.specialityId, d.speciality.name)
  })
  return [...map]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

// Active doctors of one speciality
export const getDoctorsOfSpeciality = (doctors, specialityId) =>
  doctors.filter((d) => d.isActive && d.speciality?.specialityId === specialityId)

// "HH:mm" free times of one day, without the ones already past.
// availabilities: [{ id, date: "YYYY-MM-DD", time: "HH:mm" }]
export function getFreeTimes(availabilities, day, now = new Date()) {
  const isoDay = toIsoDate(day)
  return availabilities
    .filter((slot) => slot.date === isoDay && !isPastSlot(day, slot.time, now))
    .map((slot) => slot.time)
}

// The grid works with { date: Date, time }; this finds the backend slot behind it
export const findAvailability = (availabilities, slot) =>
  slot ? availabilities.find((a) => a.date === toIsoDate(slot.date) && a.time === slot.time) ?? null : null
