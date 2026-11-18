import { apiClient } from '../../../services/apiClient'

// POST /api/auth/patient/login
// Si el DNI no esta registrado, se crea el paciente automaticamente.
// Returns { token, role }.
export async function loginPatient({ email, dni }) {
  const response = await apiClient.post('/api/auth/patient/login', { email, dni })
  return response.data
}

export async function getDoctor(pageSize, pageIndex) {
  const response = await apiClient.get(`/api/doctors?pageSize=${pageSize}&pageIndex=${pageIndex}`);
  console.log("response",response);
  return response?.data?.data;
}

// GET /api/doctors/allDoctors (not paginated)
// -> [{ id, name, licenseNumber, isActive, speciality: { specialityId, name } }]
export async function getAllDoctors() {
  const response = await apiClient.get('/api/doctors/allDoctors')
  return Array.isArray(response.data) ? response.data : []
}

// GET /api/specialties/allSpeciality (not paginated) -> [{ id, name, description }]
// Note: today the backend only allows admins here, so a patient token gets 401/403.
export async function getAllSpecialities() {
  const response = await apiClient.get('/api/specialties/allSpeciality')
  return Array.isArray(response.data) ? response.data : []
}

// TODO: GET /api/doctors/{id}/availabilities. For now no slots are returned.
// eslint-disable-next-line no-unused-vars
const pad = (number) => String(number).padStart(2, '0')

// The backend sends SlotDate.ToString(), which depends on the server culture:
// "11/24/2026" (en-US, M/d/yyyy) or "2026-11-24". Returns "YYYY-MM-DD".
function toIsoDate(value) {
  const text = String(value).trim()
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const slashed = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashed) return `${slashed[3]}-${pad(slashed[1])}-${pad(slashed[2])}`
  return null
}

// StartTime.ToString(): "8:30 AM" (en-US), "08:30" or "08:30:00". Returns "HH:mm".
function toTime(value) {
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/)
  if (!match) return null
  let hours = Number(match[1])
  const period = match[3]?.toUpperCase()
  if (period === 'PM' && hours < 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return `${pad(hours)}:${match[2]}`
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
      date: toIsoDate(item.day),
      time: toTime(item.startTime),
      endTime: toTime(item.endTime),
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

const mapAppointment = (a) => ({
  id: a.id,
  speciality: a.doctor?.speciality?.name,
  doctorName: a.doctor?.name,
  date: a.dateTime.slice(0, 10),     // "2026-10-28"
  time: a.dateTime.slice(11, 16),    // "10:30"
  status: a.status.toLowerCase(),    // "confirmed" / "pending"
})

export async function getMyAppointments() {
  const response = await apiClient.get('/api/appointments/me')
  return (response.data.data ?? response.data).map(mapAppointment)
}

export async function cancelAppointment(id) {
  await apiClient.delete('/api/appointments/{id}')  
}
