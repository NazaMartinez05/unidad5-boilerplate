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

export function getDoctorSlots(doctorId, date) {
  return []
}
