const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const SHORT_DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Monday of the given week. On weekends, jumps to the next Monday.
export function getWeekStart(date) {
  const monday = new Date(date)
  monday.setHours(0, 0, 0, 0)
  const day = monday.getDay()
  const offset = day === 0 ? 1 : day === 6 ? 2 : 1 - day
  return addDays(monday, offset)
}

// Monday to Friday
export function getWorkWeek(weekStart) {
  return [0, 1, 2, 3, 4].map((offset) => addDays(weekStart, offset))
}

// "Lunes 26 - Viernes 30, Octubre" (or with both months when the week spans two)
export function formatWeekRange(days) {
  const first = days[0]
  const last = days[days.length - 1]
  const firstLabel = `${DAY_NAMES[first.getDay()]} ${first.getDate()}`
  const lastLabel = `${DAY_NAMES[last.getDay()]} ${last.getDate()}`

  if (first.getMonth() === last.getMonth()) {
    return `${firstLabel} - ${lastLabel}, ${MONTH_NAMES[first.getMonth()]}`
  }
  return `${firstLabel} de ${MONTH_NAMES[first.getMonth()]} - ${lastLabel} de ${MONTH_NAMES[last.getMonth()]}`
}

// "Lunes 26 de Octubre" (or "Lunes 26 de Octubre de 2026" with withYear)
export function formatLongDate(date, { withYear = false } = {}) {
  const text = `${DAY_NAMES[date.getDay()]} ${date.getDate()} de ${MONTH_NAMES[date.getMonth()]}`
  return withYear ? `${text} de ${date.getFullYear()}` : text
}

// Local date -> "YYYY-MM-DD" (same format the backend dates are converted to)
export function toIsoDate(date) {
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Minutes between two "HH:mm" times
export function minutesBetween(start, end) {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  return toMinutes(end) - toMinutes(start)
}

// "2026-10-24" (backend / date input format) -> "24 Oct, 2026"
export function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T00:00`)
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)}, ${date.getFullYear()}`
}

// "2026-10-24" (backend / date input format) -> "24 Oct, 2026"
export function formatShortDate(isoDate) {
  const date = new Date(`${isoDate}T00:00`)
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)}, ${date.getFullYear()}`
}

export function getShortDayName(date) {
  return SHORT_DAY_NAMES[date.getDay()]
}

export function isSameDay(a, b) {
  return a.toDateString() === b.toDateString()
}

// time: "HH:mm"
export function isPastSlot(date, time) {
  const [hours, minutes] = time.split(':').map(Number)
  const slot = new Date(date)
  slot.setHours(hours, minutes, 0, 0)
  return slot <= new Date()
}