// El back devuelve los TURNOS disponibles, no el horario semanal. Ejemplo:
//   [{ id, day: "2026-11-24", startTime: "08:30", endTime: "09:00" }, ...]
// summarizeSlots los agrupa por día de la semana para armar el horario:
//   { MARTES: { startTime: "08:00", endTime: "16:00", slots: 12 }, ... }

const WEEK_DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

export const SLOT_MINUTES = 30

const pad = (number) => String(number).padStart(2, '0')

// en-US servers write times as "2:30 PM"
const hasAmPm = (value) => /[AaPp][Mm]\s*$/.test(String(value ?? '').trim())

// Slot date -> "YYYY-MM-DD". The backend sends "2026-11-24"; older versions sent
// SlotDate.ToString(), which depends on the server culture: "11/24/2026" (en-US,
// M/d/yyyy) or "24/11/2026" (es-AR, d/M/yyyy).
// timeHint: the slot startTime; with AM/PM the server is en-US (month first).
export function parseSlotDate(value, timeHint) {
  const text = String(value ?? '').trim()
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`

  const slashed = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!slashed) return null
  const first = Number(slashed[1])
  const second = Number(slashed[2])
  // A part greater than 12 can only be the day; otherwise trust the culture hint
  const isMonthFirst = second > 12 ? true : first > 12 ? false : hasAmPm(timeHint)
  const [month, day] = isMonthFirst ? [first, second] : [second, first]
  return `${slashed[3]}-${pad(month)}-${pad(day)}`
}

// Slot time -> "HH:mm". Accepts "14:30", "14:30:00" or "2:30 PM".
export function parseSlotTime(value) {
  const match = String(value ?? '').trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/)
  if (!match) return null
  let hours = Number(match[1])
  const period = match[3]?.toUpperCase()
  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return `${pad(hours)}:${match[2]}`
}

// "HH:mm" -> minutes since midnight
export const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// "2026-11-24" -> "MARTES"
const getWeekDay = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number)
  return WEEK_DAYS[new Date(year, month - 1, day).getDay()]
}

export function summarizeSlots(slots) {
  const summary = {}

  ;(Array.isArray(slots) ? slots : []).forEach((slot) => {
    const date = parseSlotDate(slot.day, slot.startTime)
    const start = parseSlotTime(slot.startTime)
    const end = parseSlotTime(slot.endTime)
    if (!date || !start || !end) return // unknown format: skip instead of breaking the page

    const weekDay = getWeekDay(date)
    const current = summary[weekDay]

    if (!current) {
      summary[weekDay] = { startTime: start, endTime: end, slots: 1 }
    } else {
      // Nos quedamos con el turno más temprano y el más tarde de ese día
      if (start < current.startTime) current.startTime = start
      if (end > current.endTime) current.endTime = end
      current.slots += 1
    }
  })

  return summary
}
