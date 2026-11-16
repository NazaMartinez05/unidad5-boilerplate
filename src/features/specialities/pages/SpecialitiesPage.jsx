
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  getSpecialities,
  deleteSpeciality,
} from '../services/specialitiesService'

function SpecialitiesPage() {
  const location = useLocation()

  const [specialities, setSpecialities] = useState([])
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10
  const [total, setTotal] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  )

  const [isDeleting, setIsDeleting] = useState(null)

  const totalPages = Math.ceil(total / pageSize)

  // Cargar especialidades
  const loadSpecialities = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getSpecialities({
        pageSize,
        pageIndex,
        name: searchName,
      })

      setSpecialities(response.data || [])
      setTotal(response.total || 0)

    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
      setSpecialities([])
      setTotal(0)

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSpecialities()
  }, [pageIndex, searchName])

  // Buscar especialidad
  const handleSearch = (event) => {
    event.preventDefault()

    const name = searchInput.trim()

    if (name && name.length < 3) {
      setErrorMessage('Ingrese al menos 3 caracteres para buscar.')
      return
    }

    if (name.length > 100) {
      setErrorMessage('El nombre no puede superar los 100 caracteres.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setPageIndex(1)
    setSearchName(name)
  }

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchInput('')
    setSearchName('')
    setPageIndex(1)
    setErrorMessage('')
    setSuccessMessage('')
  }

  // Eliminar especialidad
  const handleDelete = async (speciality) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar la especialidad "${speciality.name}"?`
    )

    if (!confirmed) return

    setIsDeleting(speciality.id)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await deleteSpeciality(speciality.id)

      setSuccessMessage(
        'La especialidad se eliminó correctamente.'
      )

      // Actualizar el total
      const newTotal = Math.max(0, total - 1)
      setTotal(newTotal)

      // Si eliminamos el último registro de una página,
      // volver a la página anterior.
      if (specialities.length === 1 && pageIndex > 1) {
        setPageIndex((current) => current - 1)
      } else {
        await loadSpecialities()
      }

    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))

    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">

      {/* Encabezado */}
      <div className="mb-7">
        <p className="mb-2 text-sm font-medium text-brand">
          Administración / Especialidades
        </p>

        <h1 className="text-3xl font-bold text-ink-strong">
          Gestión de Especialidades
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Consulte y administre las especialidades médicas del centro.
        </p>
      </div>

      {/* Barra de acciones */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-2"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Buscar por nombre..."
            maxLength={100}
            className="min-w-0 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink-strong outline-none focus:border-brand"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Buscar
          </button>

          {(searchName || searchInput) && (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={isLoading}
              className="rounded-md border border-line px-3 py-2 text-sm text-ink-soft hover:bg-hover disabled:opacity-50"
            >
              Limpiar
            </button>
          )}
        </form>

        <Link
          to="/specialities/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <span className="text-lg">+</span>
          Nueva especialidad
        </Link>

      </div>

      {/* Mensajes de éxito y error */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </div>
      )}

      {/* Tabla */}
      <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
          <h2 className="font-semibold text-ink-strong">
            Especialidades registradas
          </h2>

          <span className="text-sm text-ink-soft">
            Total: {total}
          </span>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px] text-left text-sm">

            <thead>
              <tr className="border-b border-line bg-surface-secondary text-ink-soft">
                <th className="px-5 py-4 font-semibold">
                  Nombre
                </th>

                <th className="px-5 py-4 font-semibold">
                  Descripción
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>

              {isLoading && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-5 py-10 text-center text-ink-soft"
                  >
                    Cargando especialidades...
                  </td>
                </tr>
              )}

              {!isLoading && specialities.length === 0 && !errorMessage && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-5 py-10 text-center text-ink-soft"
                  >
                    No se encontraron especialidades.
                  </td>
                </tr>
              )}

              {!isLoading && specialities.map((speciality) => (
                <tr
                  key={speciality.id}
                  className="border-b border-line last:border-0 hover:bg-hover"
                >
                  <td className="px-5 py-4 font-medium text-ink-strong">
                    {speciality.name}
                  </td>

                  <td className="px-5 py-4 text-ink-soft">
                    {speciality.description}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-2">

                      {/* Editar */}
                      <Link
                        to={`/specialities/${speciality.id}/edit`}
                        state={{ speciality }}
                        className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:bg-hover"
                      >
                        Editar
                      </Link>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={() => handleDelete(speciality)}
                        disabled={isDeleting === speciality.id || isLoading}
                        className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isDeleting === speciality.id
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Paginación */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">

          <p className="text-sm text-ink-soft">
            Página {pageIndex} de {Math.max(totalPages, 1)}
          </p>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => setPageIndex((current) => current - 1)}
              disabled={pageIndex <= 1 || isLoading}
              className="rounded-md border border-line px-3 py-2 text-sm text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={() => setPageIndex((current) => current + 1)}
              disabled={pageIndex >= totalPages || isLoading}
              className="rounded-md border border-line px-3 py-2 text-sm text-ink-strong hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default SpecialitiesPage
