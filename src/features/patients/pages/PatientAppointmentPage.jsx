import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/atoms/Button'
import AppointmentCard from '../components/AppointmentCard'
import { getMyAppointments, cancelAppointment } from '../services/patientService'

function PatientAppointmentPage() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([]);   
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyAppointments()
        setAppointments(result.data ?? result) // según si viene paginado o es un array
      } catch (err) {
        setError('No se pudieron cargar los turnos.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  // TODO: DELETE /api/appointments/{id} cuando esté el endpoint
  const handleCancel = async (id) => {
    if (!window.confirm('¿Cancelar este turno?')) return
    try {
      await cancelAppointment(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      setError('No se pudo cancelar el turno.')
    }
  }

  return (
    <main className="mx-auto w-full px-4 py-6">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Mis Turnos Médicos</h1>
          <p className="mt-1 text-sm text-ink">Consulta y gestiona las citas médicas programadas.</p>
        </div>

        <Button onClick={() => navigate('/patient-doctor')}>+ Solicitar Nuevo Turno</Button>
      </header>

      {appointments.length === 0 ? (
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
    </main>
  )
}

export default PatientAppointmentPage