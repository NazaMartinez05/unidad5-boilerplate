
import { apiClient } from '../../../services/apiClient'

// Obtener médicos activos
export async function getDashboardDoctors({
  pageSize = 5,
  pageIndex = 1,
  name = '',
} = {}) {
  const response = await apiClient.get('/api/doctors', {
    params: {
      pageSize,
      pageIndex,
      ...(name ? { name } : {}),
    },
  })

  return response.data
}

// Obtener cantidad de especialidades activas
export async function getDashboardSpecialities() {
  const response = await apiClient.get('/api/specialties', {
    params: {
      pageSize: 1,
      pageIndex: 1,
    },
  })

  return response.data
}
