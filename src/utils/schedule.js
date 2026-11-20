// El back devuelve los TURNOS disponibles, no el horario semanal. Ejemplo:
//   [{ id, day: "24/11/2026", startTime: "08:30", endTime: "09:00" }, ...]
// Esta función los agrupa por día de la semana para armar el horario:
//   { MARTES: { startTime: "08:00", endTime: "16:00", slots: 12 }, ... }

const WEEK_DAYS = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']

// "24/11/2026" → "MARTES"
const getWeekDay = (date) => {
  const [day, month, year] = date.split('/').map(Number)
  return WEEK_DAYS[new Date(year, month - 1, day).getDay()]
}

export function summarizeSlots(slots) {
  const summary = {}

  slots.forEach((slot) => {
    const weekDay = getWeekDay(slot.day)
    const start = slot.startTime.slice(0, 5) // "08:30:00" → "08:30"
    const end = slot.endTime.slice(0, 5)
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