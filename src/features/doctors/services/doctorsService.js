import { apiClient } from '../../../services/apiClient'

// GET /api/doctors?pageSize=&pageIndex=&name=
// Devuelve { pageSize, pageIndex, total, data: [{ id, name, licenseNumber, isActive, speciality: { specialityId, name } }] }
export async function getDoctors({ pageSize = 10, pageIndex = 1, name = '' } = {}) {
  const response = await apiClient.get('/api/doctors', {
    // Si name está vacío no lo mandamos (el back exige mínimo 3 caracteres)
    params: { pageSize, pageIndex, name: name || undefined },
  })
  return response.data
}

// POST /api/doctors  { name, licenseNumber, specialityId }
export async function createDoctor(doctor) {
  const response = await apiClient.post('/api/doctors', doctor)
  return response.data
}

// PUT /api/doctors/{id}  { name, licenseNumber, specialityId }
export async function updateDoctor(id, doctor) {
  const response = await apiClient.put(`/api/doctors/${id}`, doctor)
  return response.data
}

// DELETE /api/doctors/{id}  (borrado lógico, responde 204 sin contenido)
export async function deleteDoctor(id) {
  const response = await apiClient.delete(`/api/doctors/${id}`)
  return response.data
}

// GET /api/doctors/{id}/availabilities
// Devuelve [{ id, day, startTime, endTime }] o [] si nunca se cargó
export async function getDoctorAvailabilities(id) {
  const response = await apiClient.get(`/api/doctors/${id}/availabilities`)
  return response.data
}

// POST /api/availabilities  { doctorId, days: [{ day, startTime, endTime }] }
export async function createAvailability(availability) {
  const response = await apiClient.post('/api/availabilities', availability)
  return response.data
}

// PUT /api/availabilities  (mismo payload que el POST)
export async function updateAvailability(availability) {
  const response = await apiClient.put('/api/availabilities', availability)
  return response.data
}