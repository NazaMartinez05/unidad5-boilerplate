import Card from '../../shared/components/Card';
import Button from '../../../components/atoms/Button';
import TablePagination from '../../shared/components/TablePagination';
import ActiveFilters from '../components/ActiveFilters';
import AppointmentsFilters from '../components/AppointmentsFilters';
import AppointmentsTable from '../components/AppointmentsTable';
import useAppointmentsSearch, {
  PAGE_SIZE,
} from '../hook/useAppointmentsSearch';
import useFilterOptions from '../hook/useFilterOptions';

function AppointmentsSearchPage() {
  const {
    appointments,
    total,
    totalPages,
    pageIndex,
    filters,
    isLoading,
    errorMessage,
    applyFilters,
    clearFilters,
    changePage,
    reload,
  } = useAppointmentsSearch();

  const options = useFilterOptions();

  const hasFilters = Object.keys(filters).length > 0;
  const showTable = !isLoading && !errorMessage && appointments.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda Avanzada de Turnos
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Filtrá los turnos por paciente, especialidad, doctor y fecha.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-bold text-med-primary-900 pb-4 mb-4 border-b border-med-border-subtle">
          Criterios de Búsqueda
        </h2>

        <AppointmentsFilters
          specialties={options.specialties}
          doctors={options.doctors}
          optionsLoading={options.isLoading}
          optionsError={options.errorMessage}
          isSearching={isLoading}
          onSearch={applyFilters}
          onClear={clearFilters}
        />

        <ActiveFilters
          filters={filters}
          specialties={options.specialties}
          doctors={options.doctors}
        />
      </Card>

      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Turnos
          </h2>
        </div>

        {isLoading && (
          <p role="status" className="p-8 text-center text-med-text-sub">
            Cargando turnos...
          </p>
        )}

        {!isLoading && errorMessage && (
          <div role="alert" className="p-8 text-center">
            <p className="text-med-danger-text font-medium">{errorMessage}</p>
            <Button variant="outline" className="mt-4" onClick={reload}>
              Reintentar
            </Button>
          </div>
        )}

        {!isLoading && !errorMessage && appointments.length === 0 && (
          <p className="p-8 text-center text-med-text-sub">
            {hasFilters
              ? 'No se encontraron turnos con los filtros aplicados.'
              : 'Todavía no hay turnos registrados.'}
          </p>
        )}

        {showTable && <AppointmentsTable appointments={appointments} />}

        {showTable && (
          <TablePagination
            currentPage={pageIndex}
            totalPages={totalPages}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={changePage}
          />
        )}
      </Card>
    </div>
  );
}

export default AppointmentsSearchPage;
