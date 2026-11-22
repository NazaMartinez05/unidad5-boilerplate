import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../services/apiClient'
import AppointmentFilters from '../components/AppointmentFilters'
import AppointmentsTable from '../components/AppointmentsTable'
import { DEFAULT_PAGE_SIZE, getDoctors, getSpecialities, searchAppointments } from '../services/appointmentService'

// Same names as the inputs of AppointmentFilters. '' = "no filter".
const EMPTY_FILTERS = { dni: '', specialityId: '', doctorId: '', date: '' }

function getErrorMessage(error, fallback) {
  const status = error.response?.status
  if (status === 401 || status === 403) {
    return 'No tiene permisos para ver las citas. Inicie sesión como administrador.'
  }
  return getApiErrorMessage(error, fallback)
}

function AppointmentSearchPage() {
  const [specialities, setSpecialities] = useState([])
  const [doctors, setDoctors] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(1)
  // key: the filters + page this result belongs to
  const [result, setResult] = useState({ key: null, appointments: [], total: 0, error: '' })
  const [catalogError, setCatalogError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Filter combos: loaded once when entering the page
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

  // Table: reloaded every time the filters or the page change.
  // With no filters (on entering the page) it shows every appointment.
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
        setResult({
          key: requestKey,
          appointments: [],
          total: 0,
          error: getErrorMessage(error, 'No se pudieron cargar las citas.'),
        })
      })

    // A slower old request must not overwrite the newest one
    return () => {
      ignore = true
    }
  }, [filters, page, requestKey])

  // Loading until the result matches the current filters + page
  const isLoading = result.key !== requestKey
  const errorMessage = catalogError || (isLoading ? '' : result.error)
  const totalPages = Math.max(1, Math.ceil(result.total / DEFAULT_PAGE_SIZE))

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Búsqueda y Filtrado de Citas</h1>
        <p className="mt-1 text-sm text-ink">Gestione y supervise el flujo de pacientes del departamento.</p>
      </header>

      <AppointmentFilters
        specialities={specialities}
        doctors={doctors}
        appliedFilters={filters}
        lastUpdate={lastUpdate}
        onApply={handleApplyFilters}
      />
      {errorMessage && (
        <p role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <AppointmentsTable
        appointments={result.appointments}
        total={result.total}
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </div>
  )
}

export default AppointmentSearchPage
