
import Icon from '../../../components/atoms/Icon'
import Pagination from '../../../components/molecules/Pagination'
import SpecialityRowActions from './SpecialityRowActions'

function getSpecialityIcon(name) {
  const icons = {
    cardiología: 'heart',
    neurología: 'lightbulb',
    dermatología: 'flask',
    pediatría: 'smile',
  }

  return icons[name?.toLowerCase()] ?? 'specialities'
}
function SpecialityTable({
  specialities,
  isLoading,
  isDeleting,
  pageIndex,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const firstRecord = total === 0 ? 0 : (pageIndex - 1) * pageSize + 1
  const lastRecord = Math.min(pageIndex * pageSize, total)

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="border-b border-line px-6 py-5">
        <h2 className="text-sm font-semibold text-ink-strong">
          Registros de Especialidades
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-accent-soft text-[10px] font-semibold uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-6 py-3">Nombre de la especialidad</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-ink-soft">
                  Cargando especialidades...
                </td>
              </tr>
            ) : specialities.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-ink-soft">
                  No hay especialidades para mostrar.
                </td>
              </tr>
            ) : (
              specialities.map((speciality) => (
                <tr
                  key={speciality.id}
                  className="border-t border-line transition-colors hover:bg-hover"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        <Icon name={getSpecialityIcon(speciality.name)} size={18} />
                      </span>

                      <span className="font-semibold text-ink-strong">
                        {speciality.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-ink-soft">
                    {speciality.description}
                  </td>

                  <td className="px-6 py-3">
                    <SpecialityRowActions
                      onEdit={() => onEdit(speciality)}
                      onDelete={() => onDelete(speciality)}
                      isDeleting={isDeleting === speciality.id}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface px-6 py-3">
        <p className="text-xs text-ink-soft">
          Mostrando {firstRecord === 0 ? 0 : `${firstRecord}-${lastRecord}`} de {total} registros
        </p>

        {totalPages > 1 && (
          <Pagination
            page={pageIndex}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </section>
  )
}

export default SpecialityTable
