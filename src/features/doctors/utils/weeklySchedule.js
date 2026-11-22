import { SLOT_MINUTES, summarizeSlots, toMinutes } from '../../../utils/schedule'

// Los días como los espera el back (DayHelper acepta con y sin tilde). Sin domingo.
export const SCHEDULE_DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIÉRCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SÁBADO', label: 'Sábado' },
]

// "MIÉRCOLES" -> "MIERCOLES", para comparar sin importar tildes
const normalize = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase()

// Estado inicial: ningún día activo, horario sugerido de 08:00 a 16:00
export const emptySchedule = () =>
  Object.fromEntries(SCHEDULE_DAYS.map((day) => [day.value, { enabled: false, startTime: '08:00', endTime: '16:00' }]))

// Free slots from the backend (with dates) -> weekly schedule { LUNES: { enabled, startTime, endTime }, ... }
export function scheduleFromSlots(slots) {
  const schedule = emptySchedule()
  const summary = summarizeSlots(slots)
  SCHEDULE_DAYS.forEach((day) => {
    const found = summary[normalize(day.value)]
    if (found) schedule[day.value] = { enabled: true, startTime: found.startTime, endTime: found.endTime }
  })
  return schedule
}

// Weekly schedule -> the "days" the backend expects (only the active ones)
export function toAvailabilityDays(schedule) {
  return SCHEDULE_DAYS.filter((day) => schedule[day.value]?.enabled).map((day) => ({
    day: day.value,
    startTime: schedule[day.value].startTime,
    endTime: schedule[day.value].endTime,
  }))
}

// Returns the error message for the days to save, or '' when they are valid
export function validateAvailabilityDays(days) {
  if (days.length === 0) return 'Active al menos un día de atención.'

  const invalid = days.find((day) => !day.startTime || !day.endTime || day.startTime >= day.endTime)
  if (invalid) {
    return `Revise el ${invalid.day.toLowerCase()}: la hora de entrada debe ser anterior a la de salida.`
  }

  // Turnos de 30 minutos: entrada y salida en punto o y media (08:00, 08:30...)
  const offSlot = days.find(
    (day) => toMinutes(day.startTime) % SLOT_MINUTES !== 0 || toMinutes(day.endTime) % SLOT_MINUTES !== 0,
  )
  if (offSlot) {
    return `Revise el ${offSlot.day.toLowerCase()}: los horarios deben ser en punto o y media (rangos de ${SLOT_MINUTES} minutos).`
  }

  return ''
}
