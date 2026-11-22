import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../../../components/atoms/Alert'
import ConfirmModal from '../../../components/organisms/ConfirmModal'
import { usePaginatedList } from '../../../hooks/usePaginatedList'
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

  // Pagination, search and loading live in the hook; the page renders
  const list = usePaginatedList(getSpecialities, { pageSize: 10 })
  const { items: specialities, total, pageIndex, pageSize, totalPages, isLoading, search: searchName } = list

  const [searchInput, setSearchInput] = useState('')
  const [actionError, setActionError] = useState('') // search validation or delete error
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  )
  const [isDeleting, setIsDeleting] = useState(null)
  const errorMessage = actionError || list.error

  const handleSearch = (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setActionError(list.applySearch(searchInput))
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setActionError('')
    setSuccessMessage('')
    list.applySearch('')
  }

  // The table's delete button opens the confirmation modal
  const [toDelete, setToDelete] = useState(null)
  const closeModal = useCallback(() => setToDelete(null), [])

  const confirmDelete = async () => {
    const speciality = toDelete
    setToDelete(null)
    setIsDeleting(speciality.id)
    setActionError('')
    setSuccessMessage('')

    try {
      await deleteSpeciality(speciality.id)

      setSuccessMessage('La especialidad se eliminó correctamente.')

      if (specialities.length === 1 && pageIndex > 1) {
        list.goToPage(pageIndex - 1)
      } else {
        list.reload()
      }
    } catch (error) {
      setActionError(getApiErrorMessage(error))
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

      <Alert className="p-3">{errorMessage}</Alert>
      <Alert variant="success" className="p-3">
        {successMessage}
      </Alert>

      <SpecialityTable
        specialities={specialities}
        isLoading={isLoading}
        isDeleting={isDeleting}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={list.goToPage}
        onEdit={handleEdit}
        onDelete={setToDelete}
      />

      <ConfirmModal
        isOpen={Boolean(toDelete)}
        title="¿Eliminar especialidad?"
        message={toDelete ? `Se eliminará la especialidad "${toDelete.name}".` : ''}
        confirmLabel="Sí, eliminar"
        onConfirm={confirmDelete}
        onClose={closeModal}
      />
    </div>
  )
}

export default SpecialitiesPage
