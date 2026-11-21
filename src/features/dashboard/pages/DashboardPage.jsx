
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../components/atoms/Icon'
import { getApiErrorMessage } from '../../../services/apiClient'
import Button from '../../../components/atoms/Button'
import TextInput from '../../../components/atoms/TextInput'
import Badge from '../../../components/atoms/Badge'
import Pagination from '../../../components/molecules/Pagination'
import {
  getDashboardDoctors,
  getDashboardSpecialities,
} from '../services/dashboardService'

function DashboardPage() {
  const [doctors, setDoctors] = useState([])
  const [doctorTotal, setDoctorTotal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil((doctorTotal ?? 0) / pageSize)
  const [specialityTotal, setSpecialityTotal] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [doctorError, setDoctorError] = useState('')
  const [specialityError, setSpecialityError] = useState('')

  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      setDoctorError('')
      setSpecialityError('')

      const [doctorsResult, specialitiesResult] = await Promise.allSettled([
        getDashboardDoctors({
          pageSize,
         pageIndex: currentPage,
         name: searchName,
         }),
        getDashboardSpecialities(),
      ])

      if (doctorsResult.status === 'fulfilled') {
        setDoctors(doctorsResult.value.data || [])
        setDoctorTotal(doctorsResult.value.total)
      } else {
        setDoctorError(
          getApiErrorMessage(doctorsResult.reason)
        )
      }

      if (specialitiesResult.status === 'fulfilled') {
        setSpecialityTotal(specialitiesResult.value.total)
      } else {
        setSpecialityError(
          getApiErrorMessage(specialitiesResult.reason)
        )
      }

      setIsLoading(false)
    }

    loadDashboard()
  }, [searchName, currentPage])

  const handleSearch = (event) => {
    event.preventDefault()

    const name = searchInput.trim()

    if (name && name.length < 3) {
      setSearchError('Ingrese al menos 3 caracteres para buscar.')
      return
    }

    setSearchError('')
    setCurrentPage(1)
    setSearchName(name)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchError('')
    setCurrentPage(1)
    setSearchName('')
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Encabezado */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-brand">
          Admin / Panel Principal
        </p>

        <h1 className="text-3xl font-bold text-ink-strong">
          Vista General de Gestión
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Configure y administre los recursos del centro médico.
        </p>
      </div>

      {/* Acciones principales */}
      <div className="mb-6 flex flex-wrap gap-3">

        <Link
          to="/doctors/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <span className="text-lg">+</span>
          Agregar Nuevo Médico
        </Link>

        <Link
          to="/specialities"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-brand px-4 py-3 text-sm font-semibold text-brand transition hover:bg-hover"
        >
          <span className="text-lg">+</span>
          Agregar Nueva Especialidad
        </Link>

      </div>

      {/* Estadísticas */}
      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Médicos activos */}
        <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-soft">
                Médicos activos
              </p>

              <p className="mt-2 text-3xl font-bold text-ink-strong">
                {doctorError ? '—' : isLoading ? '...' : doctorTotal ?? '—'}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-brand">
              <Icon name="doctors" size={25} />
            </div>
          </div>
        </article>

        {/* Especialidades */}
        <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-soft">
                Especialidades
              </p>

              <p className="mt-2 text-3xl font-bold text-ink-strong">
                {specialityError ? '—' : isLoading ? '...' : specialityTotal ?? '—'}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-brand">
              <Icon name="specialities" size={25} />
            </div>
          </div>
        </article>

        {/* Turnos */}
        <article className="rounded-xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-soft">
                Citas confirmadas hoy
              </p>

              <p className="mt-2 text-3xl font-bold text-ink-strong">
                —
              </p>

              <p className="mt-1 text-xs text-ink-soft">
                Dato pendiente de integración
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-brand">
              <Icon name="dashboard" size={25} />
            </div>
          </div>
        </article>

      </section>

      {/* Directorio de médicos */}
      <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">

        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-xl font-bold text-ink-strong">
              Directorio de Profesionales Médicos
            </h2>

            <p className="mt-1 text-sm text-ink-soft">
              Consulte los médicos registrados en el sistema.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-wrap gap-2"
          >
            <TextInput
             type="search"
             value={searchInput}
             onChange={(event) => setSearchInput(event.target.value)}
             placeholder="Buscar por nombre..."
             icon="search"
           />
           <Button type="submit">
             Buscar
           </Button>

            {searchName && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-md border border-line px-3 py-2 text-sm text-ink-soft hover:bg-hover"
              >
                Limpiar
              </button>
            )}
          </form>

        </div>

        {searchError && (
          <p className="mb-4 text-sm text-danger">
            {searchError}
          </p>
        )}

        {doctorError && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-danger">
            No se pudieron cargar los médicos: {doctorError}
          </p>
        )}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px] text-left text-sm">

            <thead>
              <tr className="border-b border-line bg-surface-secondary text-ink-soft">
                <th className="px-4 py-3 font-semibold">
                  Nombre del doctor
                </th>

                <th className="px-4 py-3 font-semibold">
                  Especialidad
                </th>

                <th className="px-4 py-3 text-right font-semibold">
                 Acciones
                </th>
              </tr>
            </thead>

            <tbody>

              {isLoading && (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-ink-soft">
                    Cargando profesionales...
                  </td>
                </tr>
              )}

              {!isLoading && !doctorError && doctors.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-ink-soft">
                    No se encontraron médicos.
                  </td>
                </tr>
              )}

              {!isLoading && doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b border-line last:border-0 hover:bg-hover"
                >
                  <td className="px-4 py-4 font-medium text-ink-strong">
                    {doctor.name}
                  </td>

                  <td className="px-4 py-4 text-ink-soft">
                    {doctor.speciality?.name || 'Sin especialidad'}
                  </td>
                <td className="px-4 py-4 text-right">
                <Link to="/doctors" className="text-sm font-semibold text-brand hover:underline">
                  Ver detalle
                </Link>
                </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
        {!isLoading && !doctorError && totalPages > 1 && (
  <div className="mt-4 flex justify-end">
    <Pagination
      page={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
)}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">

          <p className="text-xs text-ink-soft">
            {doctorTotal !== null
              ? `Total de médicos activos: ${doctorTotal}`
              : 'Total de médicos: —'}
          </p>

          <Link
            to="/doctors"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Ver directorio completo →
          </Link>

        </div>

      </section>

    </div>
  )
}

export default DashboardPage
