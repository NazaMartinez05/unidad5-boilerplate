import { Link, useNavigate } from 'react-router-dom'
import Alert from '../../../components/atoms/Alert'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import Select from '../../../components/atoms/Select'
import Switch from '../../../components/atoms/Switch'
import { SLOT_MINUTES } from '../../../utils/schedule'
import { getInitials } from '../../../utils/text'
import { useDoctorSchedule } from '../hooks/useDoctorSchedule'
import { SCHEDULE_DAYS } from '../utils/weeklySchedule'

const timeInputClass =
  'w-full min-w-28 cursor-pointer rounded-md border border-field-line bg-surface px-2.5 py-2 text-sm text-ink-strong outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-ink-soft/50'

// "00:00", "00:30" ... "23:30": always 24 h (a native time input shows AM/PM
// depending on the OS/browser language) and only 30-minute steps
const TIME_OPTIONS = Array.from({ length: (24 * 60) / SLOT_MINUTES }, (_, index) => {
  const minutes = index * SLOT_MINUTES
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
})

// A saved time that is not in the list (e.g. "08:15") is still shown
const getTimeOptions = (current) =>
  current && !TIME_OPTIONS.includes(current) ? [...TIME_OPTIONS, current].sort() : TIME_OPTIONS

function DoctorAvailabilitiesPage() {
  const navigate = useNavigate()
  // Data, validation and save live in the hook; the page renders
  const {
    doctors,
    isLoadingDoctors,
    doctorId,
    selectedDoctor,
    selectDoctor,
    schedule,
    updateDay,
    isLoadingSchedule,
    isSaving,
    errorMessage,
    successMessage,
    save,
  } = useDoctorSchedule()

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
            <Select id="doctorId" options={doctorOptions} value={doctorId} onChange={(event) => selectDoctor(event.target.value)} />

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

          <Alert className="mx-5 mb-4">{errorMessage}</Alert>
          <Alert variant="success" className="mx-5 mb-4">
            {successMessage}
          </Alert>

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
                  {SCHEDULE_DAYS.map((day) => {
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
                          <select
                            aria-label={`Hora de entrada del ${day.label}`}
                            value={daySchedule.startTime}
                            disabled={!daySchedule.enabled}
                            onChange={(event) => updateDay(day.value, 'startTime', event.target.value)}
                            className={timeInputClass}
                          >
                            {getTimeOptions(daySchedule.startTime).map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <select
                            aria-label={`Hora de salida del ${day.label}`}
                            value={daySchedule.endTime}
                            disabled={!daySchedule.enabled}
                            onChange={(event) => updateDay(day.value, 'endTime', event.target.value)}
                            className={timeInputClass}
                          >
                            {getTimeOptions(daySchedule.endTime).map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
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
            <Button onClick={save} disabled={!doctorId || isLoadingSchedule || isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Disponibilidad'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default DoctorAvailabilitiesPage