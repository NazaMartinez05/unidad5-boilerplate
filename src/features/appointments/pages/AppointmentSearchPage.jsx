import Alert from '../../../components/atoms/Alert'
import AppointmentFilters from '../components/AppointmentFilters'
import AppointmentsTable from '../components/AppointmentsTable'
import { useAppointmentSearch } from '../hooks/useAppointmentSearch'

// "Búsqueda y Filtrado de Citas": the data flow lives in useAppointmentSearch
function AppointmentSearchPage() {
  const search = useAppointmentSearch()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <header>
        <h1 className="text-2xl font-bold text-ink-strong sm:text-3xl">Búsqueda y Filtrado de Citas</h1>
        <p className="mt-1 text-sm text-ink">Gestione y supervise el flujo de pacientes del departamento.</p>
      </header>

      <AppointmentFilters
        specialities={search.specialities}
        doctors={search.doctors}
        appliedFilters={search.filters}
        lastUpdate={search.lastUpdate}
        onApply={search.applyFilters}
      />

      <Alert className="px-4 py-3">{search.errorMessage}</Alert>

      <AppointmentsTable
        appointments={search.appointments}
        total={search.total}
        page={search.page}
        totalPages={search.totalPages}
        isLoading={search.isLoading}
        onPageChange={search.goToPage}
      />
    </div>
  )
}

export default AppointmentSearchPage
