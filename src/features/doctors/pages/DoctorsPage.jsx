import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../../components/atoms/Button'
import TextInput from '../../../components/atoms/TextInput'
import { getApiErrorMessage } from '../../../services/apiClient'
import { deleteDoctor, getDoctors } from '../services/doctorsService'

const PAGE_SIZE = 10

const linkButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'

const actionClass = 'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors'

function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [total, setTotal] = useState(0)
  const [pageIndex, setPageIndex] = useState(1)
  const [searchInput, setSearchInput] = useState('') // lo que se escribe en el buscador
  const [search, setSearch] = useState('') // lo que realmente se busca
  const [reloadKey, setReloadKey] = useState(0) // cambiarlo fuerza a recargar la lista
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchError, setSearchError] = useState('')

  // Trae los doctores cada vez que cambia la página, la búsqueda o se pide recargar
  useEffect(() => {
    getDoctors({ pageSize: PAGE_SIZE, pageIndex, name: search })
      .then((page) => {
        setDoctors(page.data)
        setTotal(page.total)
        setErrorMessage('')
      })
      .catch((error) => setErrorMessage(getApiErrorMessage(error)))
      .finally(() => setIsLoading(false))
  }, [pageIndex, search, reloadKey])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const reload = () => {
    setIsLoading(true)
    setReloadKey((key) => key + 1)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const text = searchInput.trim()
    if (text !== '' && text.length < 3) {
      setSearchError('Escribí al menos 3 letras para buscar.')
      return
    }
    setSearchError('')
    setPageIndex(1)
    setSearch(text)
    reload()
  }

  const goToPage = (newPage) => {
    setIsLoading(true)
    setPageIndex(newPage)
  }

  const handleDelete = async (doctor) => {
    if (!window.confirm(`¿Eliminar a ${doctor.name}?`)) return
    try {
      await deleteDoctor(doctor.id)
      // Si era el último de la página, volvemos a la anterior
      if (doctors.length === 1 && pageIndex > 1) goToPage(pageIndex - 1)
      else reload()
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título y botón de alta */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink-strong">Directorio de Doctores</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Gestione el personal médico y sus horarios de atención.
          </p>
        </div>
        <Link to="/doctors/new" className={linkButtonClass}>
          + Nuevo doctor
        </Link>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1 sm:max-w-sm">
          <TextInput
            placeholder="Buscar doctor por nombre..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            hasError={!!searchError}
          />
          {searchError && <p className="mt-1 text-xs text-danger">{searchError}</p>}
        </div>
        <Button type="submit" className="py-2.5">
          Buscar
        </Button>
      </form>

      {/* Tabla */}
      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        {isLoading && <p className="p-6 text-sm text-ink-soft">Cargando...</p>}

        {!isLoading && errorMessage && (
          <p role="alert" className="m-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {errorMessage}
          </p>
        )}

        {!isLoading && !errorMessage && doctors.length === 0 && (
          <p className="p-6 text-sm text-ink-soft">No hay doctores para mostrar.</p>
        )}

        {!isLoading && !errorMessage && doctors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Matrícula</th>
                  <th className="px-5 py-3">Especialidad</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-hover">
                    <td className="px-5 py-3.5 font-semibold text-ink-strong">{doctor.name}</td>
                    <td className="px-5 py-3.5">{doctor.licenseNumber}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
                        {doctor.speciality?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link to={`/doctors/${doctor.id}/availabilities`} className={`${actionClass} text-accent hover:bg-accent-soft`}>
                          Horarios
                        </Link>
                        <Link to={`/doctors/${doctor.id}`} className={`${actionClass} text-accent hover:bg-accent-soft`}>
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(doctor)}
                          className={`${actionClass} cursor-pointer text-danger hover:bg-danger/10`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        <div className="flex items-center justify-between border-t border-line bg-canvas px-5 py-3 text-xs text-ink-soft">
          <span>
            Página {pageIndex} de {totalPages} · {total} doctores
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={pageIndex <= 1 || isLoading}
              onClick={() => goToPage(pageIndex - 1)}
              className="cursor-pointer rounded border border-line bg-surface px-2.5 py-1 hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              disabled={pageIndex >= totalPages || isLoading}
              onClick={() => goToPage(pageIndex + 1)}
              className="cursor-pointer rounded border border-line bg-surface px-2.5 py-1 hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente ›
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DoctorsPage