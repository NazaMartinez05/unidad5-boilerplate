
import { apiClient } from '../../../services/apiClient'

// POST /api/auth/admin/login
// Recibe email y password.
// Devuelve token y role.

export async function loginAdmin({ email, password }) {
  const response = await apiClient.post('/api/auth/admin/login', {
    email,
    password,
  })

  return response.data
}
