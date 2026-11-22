import { useEffect, useMemo, useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient'
import { addDays, getWeekStart, getWorkWeek } from '../../../utils/dates'
import { createAppointment, getAllDoctors, getDoctorAvailabilities } from '../services/patientService'
import { findAvailability, getDoctorsOfSpeciality, getFreeTimes, getSpecialitiesFromDoctors } from '../utils/booking'

// The design has no "reason" field, but POST /api/appointments requires one
// (at least 5 characters). Replace with a form field if one is added.
const DEFAULT_REASON = 'Consulta médica'

// Data flow of "Reservar Turno": speciality/doctor combos, the doctor's free
// slots by week, the chosen slot and its confirmation.
// dni: the patient's (from useAuth), sent with the appointment.
export function useBooking(dni) {
  const currentWeekStart = getWeekStart(new Date()) // para volver a hoy y bloquear semanas pasadas

  const [doctors, setDoctors] = useState([])
  const [specialityId, setSpecialityId] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [doctor, setDoctor] = useState(null) // the doctor whose availability is shown
  const [availabilities, setAvailabilities] = useState([])
  const [weekStart, setWeekStart] = useState(currentWeekStart) // lunes de la semana que se esta viendo
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Una sola llamada al entrar: las especialidades salen de los doctores
  useEffect(() => {
    getAllDoctors()
      .then(setDoctors)
      .catch((error) => {
        setErrorMessage(getApiErrorMessage(error, 'No se pudieron cargar los doctores y especialidades.'))
      })
  }, [])

  const specialities = useMemo(() => getSpecialitiesFromDoctors(doctors), [doctors])
  const specialityDoctors = useMemo(() => getDoctorsOfSpeciality(doctors, specialityId), [doctors, specialityId])

  const selectSpeciality = (id) => {
    setSpecialityId(id)
    setDoctorId('') // al cambiar de especialidad, se limpia el doctor
  }

  // GET /api/doctors/{id}/availabilities
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

  const searchAvailability = () => {
    const selected = doctors.find((d) => d.id === doctorId)
    if (!selected) return
    setDoctor(selected)
    setSelectedSlot(null)
    setWeekStart(currentWeekStart)
    setErrorMessage('')
    setSuccessMessage('')
    loadAvailabilities(selected.id)
  }

  const selectSlot = (slot) => {
    setSelectedSlot(slot)
    setSuccessMessage('')
  }

  const selectedAvailability = findAvailability(availabilities, selectedSlot)

  // POST /api/appointments
  const confirm = async () => {
    if (!selectedAvailability) return
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

  return {
    // combos
    specialities,
    specialityId,
    selectSpeciality,
    specialityDoctors,
    doctorId,
    selectDoctor: setDoctorId,
    searchAvailability,
    // availability grid
    doctor,
    weekDays: getWorkWeek(weekStart),
    getSlots: (day) => getFreeTimes(availabilities, day),
    isLoadingSlots,
    canGoPrev: weekStart > currentWeekStart,
    prevWeek: () => setWeekStart(addDays(weekStart, -7)),
    nextWeek: () => setWeekStart(addDays(weekStart, 7)),
    selectedSlot,
    selectSlot,
    // summary + confirmation
    selectedAvailability,
    isConfirming,
    confirm,
    errorMessage,
    successMessage,
  }
}
