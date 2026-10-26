import { apiClient } from '../../../services/apiClient'

// POST /api/auth/patient/login
// If the DNI is not registered yet, the backend creates the patient (first access).
// Returns { token, role }.
export async function loginPatient({ email, dni }) {
  const response = await apiClient.post('/api/auth/patient/login', { email, dni })
  return response.data
}
