import { apiClient } from '../../../services/apiClient'
import { getSession } from '../../../services/session'
import { parseSlotDate, parseSlotTime } from '../../../utils/schedule'

// POST /api/auth/patient/login
// Si el DNI no esta registrado, se crea el paciente automaticamente.
// Returns { token, role }.
export async function loginPatient({ email, dni }) {
  const response = await apiClient.post('/api/auth/patient/login', { email, dni })
  return response.data
}

// GET /api/doctors/allDoctors (not paginated)
// -> [{ id, name, licenseNumber, isActive, speciality: { specialityId, name } }]
export async function getAllDoctors() {
  const response = await apiClient.get('/api/doctors/allDoctors')
  return Array.isArray(response.data) ? response.data : []
}

// GET /api/doctors/{id}/availabilities (patient token)
// -> [{ id, day, startTime, endTime }], one item per free slot.
// Returns [{ id, date: "YYYY-MM-DD", time: "HH:mm", endTime: "HH:mm" }] sorted by date and time.
export async function getDoctorAvailabilities(doctorId) {
  const response = await apiClient.get(`/api/doctors/${doctorId}/availabilities`)
  const items = Array.isArray(response.data) ? response.data : []

  return items
    .map((item) => ({
      id: item.id,
      date: parseSlotDate(item.day, item.startTime),
      time: parseSlotTime(item.startTime),
      endTime: parseSlotTime(item.endTime),
    }))
    .filter((slot) => slot.id && slot.date && slot.time)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
}

// POST /api/appointments (patient token)
// reason: the backend requires at least 5 characters.
export async function createAppointment({ doctorId, availabilitySlotId, dni, reason }) {
  const response = await apiClient.post('/api/appointments', {
    doctorId,
    availabilitySlotId,
    patient: { dni: Number(dni) },
    reason,
  })
  return response.data
}

// Backend AppointmentStatus -> the status keys AppointmentCard knows
const APPOINTMENT_STATUS = {
  booked: 'confirmed',
  pending: 'pending',
}

// Today GET /api/appointments/patient only returns
// { id, availabilitySlotId, reason, status }. Doctor, speciality, date and
// time stay null until the backend adds them (dateTime or date + startTime).
const mapAppointment = (a) => ({
  id: a.id,
  speciality: a.doctor?.speciality?.name ?? null,
  doctorName: a.doctor?.name ?? null,
  date: a.dateTime?.slice(0, 10) ?? (a.date ? parseSlotDate(a.date, a.startTime) : null), // "2026-10-28"
  time: a.dateTime?.slice(11, 16) ?? (a.startTime ? parseSlotTime(a.startTime) : null), // "10:30"
  reason: a.reason ?? '',
  status: APPOINTMENT_STATUS[String(a.status ?? '').toLowerCase()] ?? 'pending',
})

// GET /api/appointments/patient?dni= (patient token). The dni is saved at login.
export async function getMyAppointments() {
  const { dni } = getSession()
  if (!dni) throw new Error('No hay DNI en la sesión. Inicie sesión nuevamente.')

  const response = await apiClient.get('/api/appointments/patient', { params: { dni } })
  const items = response.data?.data ?? response.data
  return Array.isArray(items) ? items.map(mapAppointment) : []
}

// DELETE /api/appointments/{id} (patient token)
export async function cancelAppointment(id) {
  await apiClient.delete(`/api/appointments/${id}`)
}
