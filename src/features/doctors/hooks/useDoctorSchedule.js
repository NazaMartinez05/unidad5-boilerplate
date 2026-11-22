import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  createAvailability,
  getAllDoctors,
  getDoctorAvailabilities,
  updateAvailability,
} from '../services/doctorsService'
import { emptySchedule, scheduleFromSlots, toAvailabilityDays, validateAvailabilityDays } from '../utils/weeklySchedule'

// Data flow of "Gestionar Disponibilidad Horaria": doctors list, the chosen
// doctor's weekly schedule, edits, validation and save (POST first time, PUT after).
export function useDoctorSchedule() {
  const [doctors, setDoctors] = useState([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [doctorId, setDoctorId] = useState('')
  const [schedule, setSchedule] = useState(emptySchedule)
  const [hasExisting, setHasExisting] = useState(false) // ¿ya tenía horarios? -> PUT, si no -> POST
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
    let ignore = false
    getDoctorAvailabilities(doctorId)
      .then((slots) => {
        if (ignore) return
        const list = Array.isArray(slots) ? slots : []
        setSchedule(scheduleFromSlots(list))
        setHasExisting(list.length > 0)
      })
      .catch((error) => {
        if (!ignore) setErrorMessage(`No se pudieron cargar los horarios. ${getApiErrorMessage(error, '')}`)
      })
      .finally(() => {
        if (!ignore) setIsLoadingSchedule(false)
      })
    return () => {
      ignore = true
    }
  }, [doctorId])

  const selectDoctor = (id) => {
    setErrorMessage('')
    setSuccessMessage('')
    setSchedule(emptySchedule())
    setHasExisting(false)
    setIsLoadingSchedule(Boolean(id))
    setDoctorId(id)
  }

  // Cambia un campo (enabled, startTime o endTime) de un día
  const updateDay = (dayValue, field, value) => {
    setSuccessMessage('')
    setSchedule((current) => ({ ...current, [dayValue]: { ...current[dayValue], [field]: value } }))
  }

  const save = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (!doctorId) {
      setErrorMessage('Seleccione un profesional.')
      return
    }

    const days = toAvailabilityDays(schedule)
    const validationError = validateAvailabilityDays(days)
    if (validationError) {
      setErrorMessage(validationError)
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

  return {
    doctors,
    isLoadingDoctors,
    doctorId,
    selectedDoctor: doctors.find((doctor) => doctor.id === doctorId),
    selectDoctor,
    schedule,
    updateDay,
    isLoadingSchedule,
    isSaving,
    errorMessage,
    successMessage,
    save,
  }
}
