import { useEffect, useMemo, useState } from 'react'
import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import FormField from '../../../components/molecules/FormField'
import DoctorCard from '../components/DoctorCard'
import SelectedAppointmentBar from '../components/SelectedAppointmentBar'
import WeeklyAvailability from '../components/WeeklyAvailability'
import Select from '../../../components/atoms/Select'
import { getApiErrorMessage } from '../../../services/apiClient'
import { getSession } from '../../../services/session'
import { addDays, getWeekStart, getWorkWeek, isPastSlot, toIsoDate } from '../../../utils/dates'
import {
  createAppointment,
  getAllDoctors,
  getDoctorAvailabilities,
} from '../services/patientService'

// The design has no "reason" field, but POST /api/appointments requires one
// (at least 5 characters). Replace with a form field if one is added.
const DEFAULT_REASON = 'Consulta médica'

// Unique specialities of the active doctors. GET /api/specialties/allSpeciality
// is admin-only (403 for a patient), and the doctors list already has them.
function getSpecialitiesFromDoctors(doctors) {
  const map = new Map()
  doctors.forEach((d) => {
    if (d.isActive && d.speciality?.specialityId) map.set(d.speciality.specialityId, d.speciality.name)
  })
  return [...map]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

const alertClass = 'rounded-md border px-4 py-3 text-sm'

function PatientCheckDoctor() {
  const currentWeekStart = getWeekStart(new Date())//ref para volver a hoy y bloquear semanas pasadas
  const [weekStart, setWeekStart] = useState(currentWeekStart)//guarda el lunes de la semana que se esta viendo
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [specialityId, setSpecialityId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [doctor, setDoctor] = useState(null)
  const [availabilities, setAvailabilities] = useState([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // Carga los doctores al entrar a la pagina (una sola llamada: las especialidades salen de ahi)
  useEffect(() => {
    getAllDoctors()
      .then(setDoctors)
      .catch((error) => {
        setErrorMessage(getApiErrorMessage(error, 'No se pudieron cargar los doctores y especialidades.'))
      })
  }, [])

  const specialities = useMemo(() => getSpecialitiesFromDoctors(doctors), [doctors])

  const specialityOptions = useMemo(
    () => [
      { value: '', label: 'Seleccione una especialidad' },
      ...specialities.map((s) => ({ value: s.id, label: s.name })),
    ],
    [specialities],
  )

  // Doctores activos de la especialidad elegida
  const doctorOptions = useMemo(
    () => [
      { value: '', label: 'Seleccione un doctor' },
      ...doctors
        .filter((d) => d.isActive && d.speciality?.specialityId === specialityId)
        .map((d) => ({ value: d.id, label: d.name })),
    ],
    [doctors, specialityId],
  )

  const handleSpecialityChange = (e) => {
    setSpecialityId(e.target.value)
    setDoctorId('') // al cambiar de especialidad, se limpia el doctor
  }

  // Trae los turnos libres del doctor (GET /api/doctors/{id}/availabilities)
  const loadAvailabilities = async (id) => {
    setIsLoadingSlots(true)
    try {
      setAvailabilities(await getDoctorAvailabilities(id))
    } catch (error) {
      setAvailabilities([])
      setErrorMessage(getApiErrorMessage(error, 'No se pudo cargar la disponibilidad del doctor.'))
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleSearch = () => {
    const selected = doctors.find((d) => d.id === doctorId)
    if (!selected) return
    setDoctor(selected)
    setSelectedSlot(null)
    setWeekStart(currentWeekStart)
    setErrorMessage('')
    setSuccessMessage('')
    loadAvailabilities(selected.id)
  }

  // Para un dia dado, los horarios libres del doctor que todavia no pasaron
  const getSlots = (day) => {
    const isoDay = toIsoDate(day)
    return availabilities
      .filter((slot) => slot.date === isoDay && !isPastSlot(day, slot.time))
      .map((slot) => slot.time)
  }

  // The grid works with { date, time }; this finds the backend slot behind it
  const selectedAvailability = selectedSlot
    ? availabilities.find((slot) => slot.date === toIsoDate(selectedSlot.date) && slot.time === selectedSlot.time)
    : null

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot)
    setSuccessMessage('')
  }

  // POST /api/appointments
  const handleConfirm = async () => {
    if (!selectedAvailability) return
    const { dni } = getSession()
    if (!dni) {
      setErrorMessage('No se encontró su DNI en la sesión. Cierre sesión e ingrese nuevamente.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsConfirming(true)
    try {
      await createAppointment({
        doctorId: doctor.id,
        availabilitySlotId: selectedAvailability.id,
        dni,
        reason: DEFAULT_REASON,
      })
      setSuccessMessage('¡Turno confirmado! Lo puede ver en "Mis Turnos".')
      setSelectedSlot(null)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'No se pudo confirmar el turno. Intente nuevamente.'))
    } finally {
      setIsConfirming(false)
      // The booked slot (or one another patient took) leaves the grid
      loadAvailabilities(doctor.id)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-5">
      <section className="rounded-xl border border-field-line bg-surface p-5 sm:p-8 md:rounded-lg">
        <h1 className="text-2xl font-bold text-brand sm:text-3xl">Reservar Turno Médico</h1>
        <p className="mt-1 mb-5 text-sm text-ink md:mb-6">Seleccione la especialidad y el profesional para continuar.</p>

        <div className="grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
          <FormField label="Seleccionar Especialidad" htmlFor="speciality">
            <Select
              id="speciality"
              value={specialityId}
              onChange={handleSpecialityChange}
              options={specialityOptions}
            />
          </FormField>

          <FormField label="Seleccionar Doctor" htmlFor="doctor">
            <Select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              options={doctorOptions}
              disabled={!specialityId}
            />
          </FormField>

          <Button onClick={handleSearch} disabled={!doctorId} className="w-full py-2.5 md:w-auto">
            <Icon name="search" size={16} strokeWidth={2} />
            Buscar Disponibilidad
          </Button>
        </div>
      </section>

      {errorMessage && (
        <p role="alert" className={`${alertClass} border-danger/30 bg-danger/10 text-danger`}>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p role="status" className={`${alertClass} border-mint bg-mint/20 text-ink-strong`}>
          {successMessage}
        </p>
      )}

      {doctor && ( //se muestra solo cuando se seleccione un doctor
        <>
          <DoctorCard doctor={doctor} />

          <WeeklyAvailability
            weekDays={getWorkWeek(weekStart)}
            getSlots={getSlots}
            isLoading={isLoadingSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            canGoPrev={weekStart > currentWeekStart}
            onPrevWeek={() => setWeekStart(addDays(weekStart, -7))}
            onNextWeek={() => setWeekStart(addDays(weekStart, 7))}
          />

          <SelectedAppointmentBar
            slot={selectedAvailability ? selectedSlot : null}
            endTime={selectedAvailability?.endTime}
            isConfirming={isConfirming}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  )
}

export default PatientCheckDoctor