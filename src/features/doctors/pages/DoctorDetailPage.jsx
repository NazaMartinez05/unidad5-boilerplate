import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Icon from '../../../components/atoms/Icon'
import Badge from '../../../components/atoms/Badge'
import { getApiErrorMessage } from '../../../services/apiClient'
import { getAllDoctors, getDoctorAvailabilities } from '../services/doctorsService'
import { summarizeSlots } from '../../../utils/schedule'
import { getInitials } from '../../../utils/text'
import Alert from '../../../components/atoms/Alert'

const DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SABADO', label: 'Sábado' },
]

// Si el doctor no tiene horarios, el back responde 404: lo tomamos como "sin horarios"
const loadAvailabilities = async (id) => {
  try {
    return await getDoctorAvailabilities(id)
  } catch (error) {
    if (error.response?.status === 404) return []
    if (error.response?.status === 403) {
      throw new Error('Su usuario no tiene permisos para consultar los horarios de este doctor.', { cause: error })
    }
    throw error
  }
}

// Ruta: /doctors/:id/detail → muestra los datos del doctor y sus horarios (solo lectura)
function DoctorDetailPage() {
  const { id } = useParams()
  const location = useLocation()

  // Si venimos desde la tabla, el doctor llega en el "state" del Link
  const doctorFromList = location.state?.doctor

  const [doctor, setDoctor] = useState(doctorFromList ?? null)
  const [availabilities, setAvailabilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Si se entró directo por URL (sin pasar por la tabla), buscamos el doctor
        if (!doctorFromList) {
          const doctors = await getAllDoctors()
          const found = doctors.find((item) => item.id === id)
          if (!found) {
            setErrorMessage('No se encontró el doctor.')
            return
          }
          setDoctor(found)
        }
        setAvailabilities(await loadAvailabilities(id))
      } catch (error) {
        setErrorMessage(error.response ? getApiErrorMessage(error) : error.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, doctorFromList])

  // Agrupamos los turnos disponibles por día de la semana
  const summary = summarizeSlots(availabilities)
  const schedule = DAYS.map((day) => ({ ...day, availability: summary[day.value] }))

  return (
    <div className="flex max-w-4xl flex-col gap-5">
      {/* Ruta de navegación */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm">
        <Link to="/doctors" className="text-ink-soft hover:text-brand">
          Doctores
        </Link>
        <Icon name="chevronRight" size={14} />
        <span className="font-semibold text-brand">Detalle del Doctor</span>
      </nav>

      <Alert>{errorMessage}</Alert>

      {isLoading && <p className="text-sm text-ink-soft">Cargando...</p>}

      {!isLoading && doctor && (
        <>
          {/* Datos del doctor */}
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface p-6">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg font-bold text-accent">
                {getInitials(doctor.name)}
              </span>
              <div>
                <h1 className="text-xl font-bold text-ink-strong">{doctor.name}</h1>
                <p className="text-sm text-ink-soft">Matrícula: {doctor.licenseNumber}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant="info">{doctor.speciality?.name ?? 'Sin especialidad'}</Badge>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      doctor.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {doctor.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/doctors/${doctor.id}`}
              state={{ doctor }}
              className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              <Icon name="edit" size={16} />
              Editar Doctor
            </Link>
          </section>

          {/* Horarios de atención */}
          <section className="overflow-hidden rounded-lg border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-canvas px-6 py-4">
              <h2 className="flex items-center gap-2 font-bold text-ink-strong">
                <Icon name="clock" size={18} />
                Horarios de Atención
              </h2>
              <Link to="/doctors/availabilities" className="text-sm font-semibold text-brand hover:underline">
                Configurar horarios
              </Link>
            </div>

            {availabilities.length === 0 ? (
              <p className="px-6 py-5 text-sm text-ink-soft">
                Este doctor no tiene turnos disponibles. Configure sus horarios.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-[11px] uppercase tracking-wider text-ink-soft">
                  <tr>
                    <th className="px-6 py-3">Día</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Horario</th>
                    <th className="px-6 py-3 text-right">Turnos libres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {schedule.map(({ value, label, availability }) => (
                    <tr key={value}>
                      <td className="px-6 py-3 font-medium text-ink-strong">{label}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            availability ? 'bg-emerald-50 text-emerald-700' : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {availability ? 'Atiende' : 'No atiende'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-ink-soft">
                        {availability
                          ? `${availability.startTime.slice(0, 5)} a ${availability.endTime.slice(0, 5)}`
                          : '—'}
                      </td>
                      <td className="px-6 py-3 text-right text-ink-soft">{availability?.slots ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default DoctorDetailPage