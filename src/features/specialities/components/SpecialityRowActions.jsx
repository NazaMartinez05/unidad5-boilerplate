
import Icon from '../../../components/atoms/Icon'

function SpecialityRowActions({ onEdit, onDelete, isDeleting = false }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Editar especialidad"
        title="Editar especialidad"
        className="text-accent transition-colors hover:text-accent-strong"
      >
        <Icon name="edit" size={15} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Eliminar especialidad"
        title="Eliminar especialidad"
        disabled={isDeleting}
        className="text-danger transition-colors hover:text-danger/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  )
}

export default SpecialityRowActions
