import { apiClient } from '../../../services/apiClient'

// GET /api/specialties/allSpeciality  (todas, sin paginar: para los desplegables; solo admin)
// Devuelve [{ id, name, description }]. Single implementation: doctors and appointments reuse it.
export async function getAllSpecialities() {
  const response = await apiClient.get('/api/specialties/allSpeciality')
  return Array.isArray(response.data) ? response.data : []
}

// GET: listar especialidades
export async function getSpecialities({
  pageSize = 10,
  pageIndex = 1,
  name = '',
} = {}) {
  const response = await apiClient.get('/api/specialties', {
    params: {
      pageSize,
      pageIndex,
      ...(name ? { name } : {}),
    },
  })

  return response.data
}

// POST: crear especialidad
export async function createSpeciality({ name, description }) {
  const response = await apiClient.post('/api/specialties', {
    name,
    description,
  })

  return response.data
}

// PUT: modificar especialidad
export async function updateSpeciality(id, { name, description }) {
  const response = await apiClient.put(`/api/specialties/${id}`, {
    name,
    description,
  })

  return response.data
}

// DELETE: eliminar especialidad
export async function deleteSpeciality(id) {
  const response = await apiClient.delete(`/api/specialties/${id}`)

  return response.data
}
