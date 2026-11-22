import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../../../components/atoms/Alert'
import Badge from '../../../components/atoms/Badge'
import ConfirmModal from '../../../components/organisms/ConfirmModal'
import Icon from '../../../components/atoms/Icon'
import TextInput from '../../../components/atoms/TextInput'
import Pagination from '../../../components/molecules/Pagination'
import { usePaginatedList } from '../../../hooks/usePaginatedList'
import { getApiErrorMessage } from '../../../services/apiClient'
import { getInitials } from '../../../utils/text'
import { deleteDoctor, getDoctors } from '../services/doctorsService'

const linkButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'

const iconButtonClass = 'inline-flex cursor-pointer rounded-md p-1.5 transition-colors'

function DoctorsPage() {
  // Pagination, search and loading live in the hook; the page renders
  const list = usePaginatedList(getDoctors, { pageSize: 10 })
  const { items: doctors, total, pageIndex, totalPages, isLoading, goToPage, reload } = list

  const [searchInput, setSearchInput] = useState('') // lo que se escribe en el buscador
  const [searchError, setSearchError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const errorMessage = deleteError || list.error

  // Se busca al apretar Enter en el buscador
  const handleSearch = (event) => {
    event.preventDefault()
    setDeleteError('')
    setSearchError(list.applySearch(searchInput))
  }

  // Borrado lógico (obligatorio según la consigna): the trash button opens the modal
  const [toDelete, setToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const closeModal = useCallback(() => setToDelete(null), [])

  const confirmDelete = async () => {
    setDeleteError('')
    setIsDeleting(true)
    try {
      await deleteDoctor(toDelete.id)
      // Si era el último de la página, volvemos a la anterior
      if (doctors.length === 1 && pageIndex > 1) goToPage(pageIndex - 1)
      else reload()
    } catch (error) {
      setDeleteError(getApiErrorMessage(error))
    } finally {
      setIsDeleting(false)
      setToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título, buscador y acciones */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink-strong">Directorio de Doctores</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
          <form onSubmit={handleSearch} className="sm:w-64">
            <TextInput
              icon="search"
              placeholder="Buscar doctor por nombre..."
              aria-label="Buscar doctor por nombre"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              hasError={!!searchError}
            />
            {searchError && <p className="mt-1 text-xs text-danger">{searchError}</p>}
          </form>

          <Link to="/doctors/availabilities" className={linkButtonClass}>
            <Icon name="clock" size={16} />
            Agregar Disponibilidad Horaria
          </Link>
          <Link to="/doctors/new" className={linkButtonClass}>
            <Icon name="plus" size={16} strokeWidth={2} />
            Nuevo Doctor
          </Link>
        </div>
      </div>

      {/* Tabla */}
      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <h2 className="px-5 py-4 text-base font-bold text-ink-strong">Registros de Doctores</h2>

        {isLoading && <p className="px-5 pb-6 text-sm text-ink-soft">Cargando...</p>}

        {!isLoading && <Alert className="mx-5 mb-5">{errorMessage}</Alert>}

        {!isLoading && !errorMessage && doctors.length === 0 && (
          <p className="px-5 pb-6 text-sm text-ink-soft">No hay doctores para mostrar.</p>
        )}

        {!isLoading && !errorMessage && doctors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-line bg-canvas text-[11px] uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Nombre del doctor</th>
                  <th className="px-5 py-3">Especialidad</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-hover">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent">
                         {getInitials(doctor.name)}
                         <span
                          title={doctor.isActive ? 'Activo' : 'Inactivo'}
                          className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white ${
                          doctor.isActive ? 'bg-emerald-500' : 'bg-danger'
                         }`}
                         />
                        </span>
                        <div>
                          <p className="font-semibold text-ink-strong">{doctor.name}</p>
                          <p className="text-xs text-ink-soft">Matrícula: {doctor.licenseNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="info">{doctor.speciality?.name ?? 'Sin especialidad'}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <Link
                         to={`/doctors/${doctor.id}/detail`}
                         state={{ doctor }}
                         title="Ver detalle"
                         aria-label={`Ver detalle de ${doctor.name}`}
                         className={`${iconButtonClass} text-accent hover:bg-accent-soft`}
                         >
                        <Icon name="eye" size={16} />
                        </Link>
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{ doctor }}
                          title="Editar doctor"
                          aria-label={`Editar a ${doctor.name}`}
                          className={`${iconButtonClass} text-accent hover:bg-accent-soft`}
                        >
                          <Icon name="edit" size={16} />
                        </Link>
                        <button
                          type="button"
                          title="Eliminar doctor"
                          aria-label={`Eliminar a ${doctor.name}`}
                          onClick={() => setToDelete(doctor)}
                          className={`${iconButtonClass} text-danger hover:bg-danger/10`}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pie: cantidad de registros y paginación */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-canvas px-5 py-3 text-xs text-ink-soft">
          <span>
            Mostrando {doctors.length} de {total} registros
          </span>
          <Pagination page={pageIndex} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      </section>

      <ConfirmModal
        isOpen={Boolean(toDelete)}
        title="¿Eliminar doctor?"
        message={toDelete ? `Se dará de baja a ${toDelete.name}. Sus turnos ya reservados no se modifican.` : ''}
        confirmLabel="Sí, eliminar"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={closeModal}
      />
    </div>
  )
}

export default DoctorsPage