import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/atoms/Button'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  createAvailability,
  getDoctorAvailabilities,
  updateAvailability,
} from '../services/doctorsService'

// Los días como los espera el back (DayHelper acepta con y sin tilde)
const DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIÉRCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SÁBADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' },
]

// "MIÉRCOLES" → "MIERCOLES", para comparar sin importar tildes
const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

// Estado inicial: ningún día marcado, horario sugerido de 09:00 a 13:00
const emptySchedule = () =>
  Object.fromEntries(DAYS.map((day) => [day.value, { enabled: false, startTime: '09:00', endTime: '13:00' }]))

const timeInputClass =
  'rounded-md border border-field-line bg-field px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-40'

function DoctorAvailabilitiesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const doctor = location.state?.doctor // llega desde el botón "Horarios" de la tabla

  const [schedule, setSchedule] = useState(emptySchedule)
  const [hasExisting, setHasExisting] = useState(false) // ¿ya tenía horarios? → PUT, si no → POST
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Carga los horarios que ya tenga el doctor
  useEffect(() => {
    getDoctorAvailabilities(id)
      .then((availabilities) => {
        if (availabilities.length === 0) return
        setHasExisting(true)
        setSchedule((current) => {
          const updated = { ...current }
          DAYS.forEach((day) => {
            const found = availabilities.find((item) => normalize(item.day) === normalize(day.value))
            if (found) {
              updated[day.value] = {
                enabled: true,
                startTime: found.startTime.slice(0, 5), // "09:00:00" → "09:00"
                endTime: found.endTime.slice(0, 5),
              }
            }
          })
          return updated
        })
      })
      .catch((error) =>
        setErrorMessage(`No se pudieron cargar los horarios actuales. ${getApiErrorMessage(error, '')}`),
      )
      .finally(() => setIsLoading(false))
  }, [id])

  // Cambia un campo (enabled, startTime o endTime) de un día
  const updateDay = (dayValue, field, value) => {
    setSuccessMessage('')
    setSchedule((current) => ({ ...current, [dayValue]: { ...current[dayValue], [field]: value } }))
  }

  const handleSave = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    const days = DAYS.filter((day) => schedule[day.value].enabled).map((day) => ({
      day: day.value,
      startTime: schedule[day.value].startTime,
      endTime: schedule[day.value].endTime,
    }))

    // Validaciones antes de llamar al back
    if (days.length === 0) {
      setErrorMessage('Marque al menos un día de atención.')
      return
    }
    const invalid = days.find((day) => !day.startTime || !day.endTime || day.startTime >= day.endTime)
    if (invalid) {
      setErrorMessage(`Revise el ${invalid.day.toLowerCase()}: la hora de inicio debe ser anterior a la de fin.`)
      return
    }

    setIsSaving(true)
    try {
      const payload = { doctorId: id, days }
      const result = hasExisting ? await updateAvailability(payload) : await createAvailability(payload)
      setHasExisting(true)
      const slots = result?.days?.reduce((total, day) => total + (day.slotsGenerated ?? 0), 0)
      setSuccessMessage(
        slots !== undefined
          ? `Horarios guardados. Se generaron ${slots} turnos de 30 minutos para el resto del mes.`
          : 'Horarios guardados.',
      )
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-ink-strong">Horarios de atención</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {doctor ? `${doctor.name} · ${doctor.speciality?.name ?? ''}` : 'Configure los días y horarios del doctor.'}
        </p>
      </div>

      <section className="rounded-lg border border-line bg-surface p-6">
        <p className="mb-4 text-sm text-ink">
          Marque los días que atiende y su horario. Se generan turnos de 30 minutos para el resto del mes
          (excepto feriados).
        </p>

        {errorMessage && (
          <p role="alert" className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p role="status" className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-ink-soft">Cargando...</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {DAYS.map((day) => {
              const daySchedule = schedule[day.value]
              return (
                <li key={day.value} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex cursor-pointer items-center gap-3 font-semibold text-ink-strong">
                    <input
                      type="checkbox"
                      checked={daySchedule.enabled}
                      onChange={(event) => updateDay(day.value, 'enabled', event.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                    {day.label}
                  </label>
                  <div className="flex items-center gap-2 text-sm text-ink-soft">
                    <input
                      type="time"
                      step="1800"
                      aria-label={`Hora de inicio del ${day.label}`}
                      value={daySchedule.startTime}
                      disabled={!daySchedule.enabled}
                      onChange={(event) => updateDay(day.value, 'startTime', event.target.value)}
                      className={timeInputClass}
                    />
                    <span>a</span>
                    <input
                      type="time"
                      step="1800"
                      aria-label={`Hora de fin del ${day.label}`}
                      value={daySchedule.endTime}
                      disabled={!daySchedule.enabled}
                      onChange={(event) => updateDay(day.value, 'endTime', event.target.value)}
                      className={timeInputClass}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="cursor-pointer rounded-md border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-hover"
          >
            Volver
          </button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar horarios'}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default DoctorAvailabilitiesPage