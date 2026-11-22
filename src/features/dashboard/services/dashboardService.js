import { getDoctors } from '../../doctors/services/doctorsService'
import { getSpecialities } from '../../specialities/services/specialitiesService'

// Médicos (paginado, con búsqueda por nombre): same call as the doctors list
export const getDashboardDoctors = getDoctors

// Cantidad de especialidades: a 1-item page is enough, only `total` is used
export function getDashboardSpecialities() {
  return getSpecialities({ pageSize: 1, pageIndex: 1 })
}
