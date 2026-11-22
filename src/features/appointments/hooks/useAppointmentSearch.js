import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient'
import { DEFAULT_PAGE_SIZE, getDoctors, getSpecialities, searchAppointments } from '../services/appointmentService'

// Same names as the inputs of AppointmentFilters. '' = "no filter".
export const EMPTY_FILTERS = { dni: '', specialityId: '', doctorId: '', date: '' }

function getErrorMessage(error, fallback) {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return 'No tiene permisos para ver las citas. Inicie sesión como administrador.'
  }
  return getApiErrorMessage(error, fallback)
}

// Data flow of "Búsqueda y Filtrado de Citas": filter combos, applied filters,
// page and the search result (stale responses are discarded).
export function useAppointmentSearch() {
  const [specialities, setSpecialities] = useState([])
  const [doctors, setDoctors] = useState([])
  const [catalogError, setCatalogError] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  // key: the filters + page this result belongs to
  const [result, setResult] = useState({ key: null, appointments: [], total: 0, error: '' })
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Filter combos: loaded once
  useEffect(() => {
    Promise.all([getSpecialities(), getDoctors()])
      .then(([specialityList, doctorList]) => {
        setSpecialities(specialityList)
        setDoctors(doctorList)
      })
      .catch((error) => {
        setCatalogError(getErrorMessage(error, 'No se pudieron cargar las especialidades y los doctores.'))
      })
  }, [])

  // Table: reloaded every time the filters or the page change (no filters = every appointment)
  const requestKey = `${page}|${JSON.stringify(filters)}`
  useEffect(() => {
    let ignore = false
    searchAppointments(filters, page, DEFAULT_PAGE_SIZE)
      .then((response) => {
        if (ignore) return
        setResult({ key: requestKey, ...response, error: '' })
        setLastUpdate(new Date())
      })
      .catch((error) => {
        if (ignore) return
        setResult({ key: requestKey, appointments: [], total: 0, error: getErrorMessage(error, 'No se pudieron cargar las citas.') })
      })
    return () => {
      ignore = true
    }
  }, [filters, page, requestKey])

  const isLoading = result.key !== requestKey

  return {
    specialities,
    doctors,
    filters,
    applyFilters: (newFilters) => {
      setFilters(newFilters)
      setPage(1)
    },
    page,
    goToPage: setPage,
    appointments: result.appointments,
    total: result.total,
    totalPages: Math.max(1, Math.ceil(result.total / DEFAULT_PAGE_SIZE)),
    isLoading,
    errorMessage: catalogError || (isLoading ? '' : result.error),
    lastUpdate,
  }
}
