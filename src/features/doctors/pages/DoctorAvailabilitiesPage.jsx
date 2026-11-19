import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import Select from '../../../components/atoms/Select'
import Switch from '../../../components/atoms/Switch'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  createAvailability,
  getAllDoctors,
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

// Estado inicial: ningún día activo, horario sugerido de 08:00 a 16:00
const emptySchedule = () =>
  Object.fromEntries(DAYS.map((day) => [day.value, { enabled: false, startTime: '08:00', endTime: '16:00' }]))

// "Elena Martínez" → "EM"
const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

const timeInputClass =
  'w-full min-w-28 rounded-md border border-field-line bg-surface px-2.5 py-2 text-sm text-ink-strong outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:border-line disabled:bg-canvas disabled:text-ink-soft/50'

function DoctorAvailabilitiesPage() {
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [schedule, setSchedule] = useState(emptySchedule)
  const [hasExisting, setHasExisting] = useState(false) // ¿ya tenía horarios? → PUT, si no → POST
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId)

  // 1) Al entrar: traer todos los doctores para el desplegable
  useEffect(() => {
    getAllDoctors()
      .then(setDoctors)
      .catch((error) => setErrorMessage(getApiErrorMessage(error)))
      .finally(() => setIsLoadingDoctors(false))
  }, [])

  // 2) Al elegir un doctor: traer los horarios que ya tenga
  useEffect(() => {
    if (!doctorId) return
    getDoctorAvailabilities(doctorId)
      .then((availabilities) => {
        const updated = emptySchedule()
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
        setSchedule(updated)
        setHasExisting(availabilities.length > 0)
      })
      .catch((error) => setErrorMessage(`No se pudieron cargar los horarios. ${getApiErrorMessage(error, '')}`))
      .finally(() => setIsLoadingSchedule(false))
  }, [doctorId])

  const handleDoctorChange = (event) => {
    setErrorMessage('')
    setSuccessMessage('')
    setSchedule(emptySchedule())
    setHasExisting(false)
    setIsLoadingSchedule(Boolean(event.target.value))
    setDoctorId(event.target.value)
  }

  // Cambia un campo (enabled, startTime o endTime) de un día
  const updateDay = (dayValue, field, value) => {
    setSuccessMessage('')
    setSchedule((current) => ({ ...current, [dayValue]: { ...current[dayValue], [field]: value } }))
  }

  const handleSave = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!doctorId) {
      setErrorMessage('Seleccione un profesional.')
      return
    }

    const days = DAYS.filter((day) => schedule[day.value].enabled).map((day) => ({
      day: day.value,
      startTime: schedule[day.value].startTime,
      endTime: schedule[day.value].endTime,
    }))

    // Validaciones antes de llamar al back
    if (days.length === 0) {
      setErrorMessage('Active al menos un día de atención.')
      return
    }
    const invalid = days.find((day) => !day.startTime || !day.endTime || day.startTime >= day.endTime)
    if (invalid) {
      setErrorMessage(`Revise el ${invalid.day.toLowerCase()}: la hora de entrada debe ser anterior a la de salida.`)
      return
    }

    setIsSaving(true)
    try {
      const payload = { doctorId, days }
      const result = hasExisting ? await updateAvailability(payload) : await createAvailability(payload)
      setHasExisting(true)
      const slots = result?.days?.reduce((total, day) => total + (day.slotsGenerated ?? 0), 0)
      setSuccessMessage(
        slots !== undefined
          ? `Disponibilidad guardada. Se generaron ${slots} turnos de 30 minutos para el resto del mes.`
          : 'Disponibilidad guardada.',
      )
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const doctorOptions = [
    { value: '', label: isLoadingDoctors ? 'Cargando...' : 'Seleccione un profesional' },
    ...doctors.map((doctor) => ({
      value: doctor.id,
      label: `${doctor.name} - ${doctor.speciality?.name ?? 'Sin especialidad'}`,
    })),
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Ruta de navegación */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm">
        <Link to="/doctors" className="text-ink-soft hover:text-brand">
          Doctores
        </Link>
        <Icon name="chevronRight" size={14} />
        <span className="font-semibold text-brand">Disponibilidad Horaria</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-ink-strong">Gestionar Disponibilidad Horaria</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Defina los días y rangos horarios de atención para el profesional seleccionado.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[18rem_1fr]">
        {/* Columna izquierda: elegir doctor + aviso */}
        <div className="flex flex-col gap-5">
          <section className="rounded-lg border border-line bg-surface p-5">
            <label htmlFor="doctorId" className="mb-2 block text-sm font-semibold text-ink-strong">
              Seleccionar Profesional
            </label>
            <Select id="doctorId" options={doctorOptions} value={doctorId} onChange={handleDoctorChange} />

            {selectedDoctor && (
              <div className="mt-4 flex items-center gap-3 rounded-md bg-highlight p-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-sm font-bold text-brand">
                  {getInitials(selectedDoctor.name)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink-strong">{selectedDoctor.name}</p>
                  <p className="text-xs text-ink-soft">Matrícula: {selectedDoctor.licenseNumber}</p>
                  <p className="text-xs font-semibold text-brand">{selectedDoctor.speciality?.name}</p>
                </div>
              </div>
            )}
          </section>

          <section className="flex gap-3 rounded-lg border border-line bg-surface p-5 text-xs text-ink">
            <span className="text-brand">
              <Icon name="help" size={18} />
            </span>
            <p>
              Se generan turnos de 30 minutos para el resto del mes en los días activos, excepto feriados. Los
              turnos ya reservados no se modifican.
            </p>
          </section>
        </div>

        {/* Columna derecha: tabla de horarios */}
        <section className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
            <h2 className="font-semibold text-ink-strong">Configuración de Horarios</h2>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft">
              <Icon name="clock" size={14} />
              Intervalos automáticos de 30 minutos
            </span>
          </div>

          {errorMessage && (
            <p role="alert" className="mx-5 mb-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className="mx-5 mb-4 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          {!doctorId ? (
            <p className="border-t border-line px-5 py-10 text-center text-sm text-ink-soft">
              Seleccione un profesional para configurar sus horarios.
            </p>
          ) : isLoadingSchedule ? (
            <p className="border-t border-line px-5 py-10 text-center text-sm text-ink-soft">Cargando horarios...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-highlight text-[11px] uppercase tracking-wider text-ink-strong">
                  <tr>
                    <th className="px-5 py-3">Día</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3">Entrada</th>
                    <th className="px-5 py-3">Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {DAYS.map((day) => {
                    const daySchedule = schedule[day.value]
                    return (
                      <tr key={day.value}>
                        <td className={`px-5 py-3 font-medium ${daySchedule.enabled ? 'text-ink-strong' : 'text-ink-soft'}`}>
                          {day.label}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={daySchedule.enabled}
                              onChange={(value) => updateDay(day.value, 'enabled', value)}
                              label={`${day.label} activo`}
                            />
                            <span className={`text-xs ${daySchedule.enabled ? 'text-brand' : 'text-ink-soft'}`}>
                              {daySchedule.enabled ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="time"
                            step="1800"
                            aria-label={`Hora de entrada del ${day.label}`}
                            value={daySchedule.startTime}
                            disabled={!daySchedule.enabled}
                            onChange={(event) => updateDay(day.value, 'startTime', event.target.value)}
                            className={timeInputClass}
                          />
                        </td>
                        <td className="px-5 py-3">
                          <input
                            type="time"
                            step="1800"
                            aria-label={`Hora de salida del ${day.label}`}
                            value={daySchedule.endTime}
                            disabled={!daySchedule.enabled}
                            onChange={(event) => updateDay(day.value, 'endTime', event.target.value)}
                            className={timeInputClass}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => navigate('/doctors')}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!doctorId || isLoadingSchedule || isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DoctorAvailabilitiesPage