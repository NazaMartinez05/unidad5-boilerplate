
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../../services/apiClient'
import {
  getSpecialities,
  deleteSpeciality,
} from '../services/specialitiesService'
import SpecialitySearch from '../components/SpecialitySearch'
import SpecialityTable from '../components/SpecialityTable'
import Button from '../../../components/atoms/Button'

function SpecialitiesPage() {
  const location = useLocation()
  const navigate = useNavigate()

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

  const handleSearch = (event) => {
    event.preventDefault()

    const name = searchInput.trim()

    if (name && name.length < 3) {
      setErrorMessage('Ingrese al menos 3 caracteres para buscar.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setPageIndex(1)
    setSearchName(name)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchName('')
    setPageIndex(1)
    setErrorMessage('')
    setSuccessMessage('')
  }

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

      setSuccessMessage('La especialidad se eliminó correctamente.')

      setTotal((current) => Math.max(0, current - 1))

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

  const handleEdit = (speciality) => {
    navigate(`/specialities/${speciality.id}/edit`, {
      state: { speciality },
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <header>
        <p className="mb-2 text-sm font-medium text-brand">
          Administración / Especialidades
        </p>

        <h1 className="text-2xl font-bold text-ink-strong">
          Directorio de Especialidades
        </h1>

        <p className="mt-1 text-sm text-ink-soft">
          Gestione las especialidades médicas registradas en el centro.
        </p>
      </header>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-72">
            <SpecialitySearch
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onSubmit={handleSearch}
            />
          </div>

          {(searchInput || searchName) && (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={isLoading}
              className="text-sm font-medium text-ink-soft hover:text-ink-strong disabled:opacity-50"
            >
              Limpiar
            </button>
          )}
        </div>

        <Link to="/specialities/new">
          <Button type="button">
            + Nueva Especialidad
          </Button>
        </Link>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-md border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      <SpecialityTable
        specialities={specialities}
        isLoading={isLoading}
        isDeleting={isDeleting}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={setPageIndex}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default SpecialitiesPage
