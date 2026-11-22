import { useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../components/atoms/Icon'
import ConfirmModal from '../../../components/organisms/ConfirmModal'
import { getApiErrorMessage } from '../../../services/apiClient'
import { useAuth } from '../../auth/hooks/useAuth'
import AppointmentCard from '../components/AppointmentCard'
import Alert from '../../../components/atoms/Alert'
import { getMyAppointments, cancelAppointment } from '../services/patientService'

function PatientAppointmentPage() {
  const navigate = useNavigate()
  const { dni } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toCancel, setToCancel] = useState(null) // appointment shown in the confirmation modal
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setAppointments(await getMyAppointments(dni))
      } catch (err) {
        // Backend message if there is one, else ours (e.g. no DNI in the session)
        setError(getApiErrorMessage(err, err.response ? 'No se pudieron cargar los turnos.' : err.message))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [dni])

  // "Cancelar Turno" on a card: open the confirmation modal
  const handleCancel = (id) => {
    setError(null)
    setToCancel(appointments.find((a) => a.id === id) ?? null)
  }

  const closeModal = useCallback(() => setToCancel(null), [])

  // DELETE /api/appointments/{id}
  const confirmCancel = async () => {
    setIsCancelling(true)
    try {
      await cancelAppointment(toCancel.id)
      setAppointments((prev) => prev.filter((a) => a.id !== toCancel.id))
      setToCancel(null)
    } catch (err) {
      setToCancel(null)
      setError(getApiErrorMessage(err, 'No se pudo cancelar el turno.'))
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Mis Turnos Médicos</h1>
          <p className="mt-1 text-sm text-ink">Consulta y gestiona las citas médicas programadas.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/patient-doctor')}
          className="cursor-pointer rounded-md bg-navy-button px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-button-hover"
        >
          + Solicitar Nuevo Turno
        </button>
      </header>

      <Alert className="mb-5 px-4 py-3">{error}</Alert>

      {isLoading ? (
        <p className="rounded-lg border border-line bg-surface p-8 text-center text-sm text-ink-soft">
          Cargando turnos...
        </p>
      ) : appointments.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface p-8 text-center text-sm text-ink">
          No tenés turnos programados.
        </p>
      ) : (
        <section className="grid gap-5 md:grid-cols-2">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} onCancel={handleCancel} />
          ))}
        </section>
      )}

      <ConfirmModal
        isOpen={Boolean(toCancel)}
        title="¿Cancelar este turno?"
        message="El horario quedará libre para otros pacientes. Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar turno"
        cancelLabel="Volver"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={confirmCancel}
        onClose={closeModal}
      >
        {toCancel && (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-highlight text-brand">
              <Icon name="calendar" size={18} />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-ink-strong">{toCancel.doctorName ?? 'Turno médico'}</p>
              <p className="text-ink">
                {toCancel.speciality && `${toCancel.speciality} · `}
                {toCancel.date ?? '—'}
                {toCancel.time && ` a las ${toCancel.time} hs`}
              </p>
            </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
}

export default PatientAppointmentPage