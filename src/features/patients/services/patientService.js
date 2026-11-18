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

export async function getDoctorSlots(doctorId, date) {
  const response = await apiClient.get(`/api/doctors/${doctorId}/availability`, {
    params: { date }, // "2026-11-03"
  })
  return response.data
}

export async function createAppointment({ doctorId, date, time }) {
  const response = await apiClient.post('/api/appointments', { doctorId, date, time })
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
